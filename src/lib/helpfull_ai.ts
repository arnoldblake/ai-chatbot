import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { 
    AZURE_OPENAI_API_INSTANCE, 
    AZURE_OPENAI_API_KEY, 
    AZURE_OPENAI_API_DEPLOYMENT_NAME,
    AZURE_OPENAI_API_VERSION
} from '$env/static/private';

const model = new ChatOpenAI({
    azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE,
    azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
    azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
    temperature: 0.9,
    // topP: 0.2,
    // maxTokens: 1000,
    // streaming: true
});

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer questions. If you receive a message that is
    not a question, introduce yourself as "Helpfull AI" a helpful and enthusiastic support bot who can answer questions. And prompt the user to ask a question.
    Try to answer the questions to the best of your ability. If the context is unclear use your best judgement to determine the context.
    If you do not know the answer say "I'm sorry but I cannot answer your question.
    Do not try to make up an answer. Always speak as if you are talking to a friend.
    context: {context} question: {standalone_question} answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser());

const standAloneQuestionTemplate = 'Given an message, convert it to a single concise clear question. question: {question} standalone question:';
const standAloneQuestionPrompt = PromptTemplate.fromTemplate(standAloneQuestionTemplate);
const standAloneQuestionChain = standAloneQuestionPrompt.pipe(model).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
    {
        standalone_question: standAloneQuestionChain,
        context: new RunnablePassthrough(),
    },
    answerChain
]);

export function invoke(question: string) {
    return chain.invoke({ question: question });
}

export function stream(question: string) {
    return chain.stream({ question: question });
}