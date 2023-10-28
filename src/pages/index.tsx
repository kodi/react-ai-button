import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiOutlineArrowPath, HiOutlineSparkles } from 'react-icons/hi2';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import GithubCorner from 'react-github-corner';

type OpenAIResponse = { choices: { message: { content: string } }[] };

export default function Home() {

  const [apiKey, setApiKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [generatedCode, setGeneratedCode] = useState<string>('// describe your component and hit generate!')
  const [prompt, setPrompt] = useState<string>('')

  // on load, check if the api key is stored in local storage
  useEffect(() => {
    // if the api key is stored in local storage, read it and save it to state
    const apiKey = localStorage.getItem('apiKey')
    if (apiKey) {
      setApiKey(apiKey)
    }
  }, [])

  // on each change to the api key, save it to local storage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey)
    }
  }, [apiKey, setApiKey]);

  const FetchOpenAI = async () => {
    setLoading(true)
    const EXAMPLE_BUTTON_COMPONENT = `
function Bookmark({ slug }) {
    return (
        <button
            formAction={async () => {
                "use server";
                await sql\`INSERT INTO Bookmarks (slug) VALUES (\${slug});\`;
            }}
        >
            <span>Bookmark</span>
        </button>
    );
}`

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          'model': 'gpt-4',
          'messages': [
            {
              'role': 'system',
              'content': `
              You are creating a single file react component.


              Here is one example of a single file react component, that is a button component that takes a slug and saves it to the slug table:
              ${EXAMPLE_BUTTON_COMPONENT}

              Based on a users prompt, and this example component generate a single file react component, following the same principle as this component,
              that is a button component that takes an input, if needed, and does appropriate SQL queries.

              Answer with javascript code only, no comments or explanations.
            `
            },
            {
              role: 'user',
              content: prompt,
            }
          ],
          'temperature': 1,
          'max_tokens': 512,
          'top_p': 1,
          'frequency_penalty': 0,
          'presence_penalty': 0
        })
      })
      const data = await res.json() as OpenAIResponse;

      if (data?.choices && data.choices.length > 0) {
        setGeneratedCode(data?.choices?.[0]?.message?.content ?? '// no code generated')
      }
      console.log(JSON.stringify(data, null, 2))

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generate your own react button!"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <GithubCorner href="https://github.com/kodi/react-ai-button"/>
      <main
        className="min-h-screen bg-black justify-center bg-[url('/img/type_001.gif')] flex items-start bg-top bg-auto bg-no-repeat">
        <div className="container mx-auto pt-[250px]">
          <div className="hero min-h-3xl glass text-white rounded-lg">
            <div className="hero-content text-center">
              <div className="max-w-4xl">
                <h1 className="text-5xl font-bold">One Button to Rule Them All 🔥</h1>
                <p className="py-4 text-xl mb-8 font-bold">We believe in living on the edge... of database disasters.
                  Push if
                  you&apos;re
                  brave, or
                  just really curious!</p>
                <div>
                  <textarea className="textarea textarea-bordered w-full text-base text-gray-600"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={'Describe your dream component. Eg. "A button component that takes a slug and saves it to the slug table".'}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-x-8 mt-4">
                  <div>
                    <input type="password" placeholder="Chat GPT-4 API Key..." value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="input input-bordered w-full input-sm text-gray-600"/>
                    <div className="text-xs">API key is saved to local storage only, it will never leave this site.
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" disabled={apiKey === ''} onClick={FetchOpenAI}>
                    <div className="flex items-center justify-center gap-x-2">
                      {loading ? (
                        <HiOutlineArrowPath className="i w-5 h-5 animate-spin"/>
                      ) : (
                        <HiOutlineSparkles className="i w-5 h-5 "/>
                      )}
                      <div>
                        {loading ? (
                          'Generating...'
                        ) : (
                          'Generate!'
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="mt-4 rounded-lg overflow-hidden shadow-xl p-4  bg-gradient-to-b from-teal-400 to-yellow-200">
            <h3 className="mb-4 text-white">Generated Code</h3>
            <div className="rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <SyntaxHighlighter language="javascript" style={gruvboxDark}>
                {generatedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
