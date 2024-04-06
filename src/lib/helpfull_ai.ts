import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { prisma } from '$lib/db';
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

export function stream(prompt: string, messages: string, threadId: string, userId: string) {
	const chain = RunnableSequence.from([
		{
			intent: intentChain,
			original_input: new RunnablePassthrough()
		},
		{
			intent: ({ intent }) => intent,
			history: ({ original_input }) => original_input.messages,
			prompt: ({ original_input }) => original_input.prompt
		},
		answerChain
	]);
	return chain.withListeners({
		onEnd: async (run) => {
			await prisma.message.create({
				data: {
					threadId: threadId,
					userId: userId,
					role: 'assistant',
					content: run.outputs.output
				}
			});
		}
	}).stream({
		prompt: prompt,
		messages: messages
	});
}
