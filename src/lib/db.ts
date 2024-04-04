import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "$lib/schema"
import pg from "pg";
import { AZURE_OPENAI_API_EMBEDDINGS_NAME, AZURE_OPENAI_API_INSTANCE, AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_VERSION, DB_CONNECTION_STRING } from '$env/static/private';

// Used for embedding
import { type PoolConfig } from "pg";
import { OpenAIEmbeddings } from "@langchain/openai";
import { type DistanceStrategy, PGVectorStore } from '@langchain/community/vectorstores/pgvector';

//
// Postgres DB Connection Pool
const { Pool } = pg;
const pool = new Pool({
    connectionString: DB_CONNECTION_STRING
});
export const db = drizzle(pool, { schema });
//

// Initialize PGVectorStore and Connection
const config = {
    postgresConnectionOptions: {
        connectionString: DB_CONNECTION_STRING,
    } as PoolConfig,
    tableName: "pg_vector_store",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine" as DistanceStrategy,
};

export const pgvectorStore = await PGVectorStore.initialize(
    new OpenAIEmbeddings({
        azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
        azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE,
        azureOpenAIApiDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_NAME,
    }),
    config
    )

// TODO: Move into helpull ai library
// Document loader & Splitter
// TODO: Move this to a separate file
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const splitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1000,
    //     chunkOverlap: 200,
    // });
    
    // const loader = new TextLoader(`static/thewaroftheworlds.txt`);
    // const docs = await loader.load();

// const docOutput = await splitter.splitDocuments([...docs
// ]);

// await pgvectorStore.addDocuments(docOutput);

// const results = await pgvectorStore.similaritySearch("water", 1);
// const retreiver = pgvectorStore.asRetriever();
// const result = await retreiver.getRelevantDocuments("After returning home from borrowing a dog-cart what does the narrator find in his home?")

// console.log(result);
