import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { prisma } from '$lib/db';
import { vectorStore } from './vdb';
import {
	AZURE_OPENAI_API_INSTANCE,
	AZURE_OPENAI_API_KEY,
	AZURE_OPENAI_API_DEPLOYMENT_NAME,
	AZURE_OPENAI_API_VERSION
} from '$env/static/private';

import { answerTemplate, intentTemplate } from '$lib/prompts';

const model = new ChatOpenAI({
	azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE,
	azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
	azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
	azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
	temperature: 0.9
	// topP: 0.2,
	// maxTokens: 1000,
	// streaming: true
});

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser());
const intentPrompt = PromptTemplate.fromTemplate(intentTemplate);
const intentChain = intentPrompt.pipe(model).pipe(new StringOutputParser());

export async function stream({ messages, onEnd }) {

	const chain = RunnableSequence.from([
		{
			intent: intentChain,
			original_input: new RunnablePassthrough()
		},
		{
			relevant_content: async ({ original_input }) => {
				const result = await vectorStore.similaritySearch(original_input.prompt, 1)
				if (result.length === 0) return '';
				return result[0].pageContent;
			},
			intent: ({ intent }) => intent,
			history: ({ original_input }) => original_input.history,
			prompt: ({ original_input }) => original_input.prompt
		},
		answerChain
	]);
	return chain.withListeners({
		onEnd: onEnd
	}).stream({
		prompt: messages.pop().content,
		history: JSON.stringify(messages)
	});
}
