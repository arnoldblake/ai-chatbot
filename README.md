## TODO

### Chat
[ ] Persist chats to database  
[ ] Allow for multiple chat threads  
[ ] Allow for multiple chat threadsthreads 
### File Upload 
[x] Update schema to store file information  
[x] Load uploaded file information to display a file list  
[ ] Check for existing file and return an error display a toast  
[ ] Method to delete uploaded files
[ ] Improve the UI for file upload and file list
### RAG
[ ] Text split and vectorize uploaded files  
[ ] Create langchain runnable sequence RAG  

## Setup

```bash
pnpm install
```

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
docker-compose up
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
