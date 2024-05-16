/** @jsxImportSource npm:preact@10.20.2 */
import vixeny from 'https://deno.land/x/endofunctor@v0.0.945/fun.ts'
import { render } from 'npm:preact-render-to-string'

Deno.serve({
  port: 8002,
  handler: vixeny()([
    { path: '/style.css', f: () => Deno.readFileSync('style.css') },
    {
      path: '/',
      type: 'response',
      r: () => new Response(render(App), { headers: { 'content-type': 'text/html; charset=utf-8' } }),
    },
    {
      path: '/download',
      type: 'response',
      r: r =>
        new Response(new URL(r.url).searchParams.get('text')!.toString(), {
          headers: {
            'content-type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="messages.json"',
          },
        }),
    },
    {
      path: '/update',
      method: 'POST',
      type: 'response',
      r: async r => {
        const text = (await r.formData()).get('text')!.toString()
        const data = await (
          await fetch('http://127.0.0.1:8040/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          })
        ).text()
        return new Response(render(<Result data={data} />), {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        })
      },
    },
  ]),
})

const App = (
  <>
    <script src='https://unpkg.com/htmx.org@1.9.12'></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          onload = () => {
            const download = document.querySelector('.download')
            download.onclick = () => {
              const text = JSON.stringify(Array.from(document.querySelectorAll('.result > div')).map(x=>({type:x.classList.contains('entry')?'question':'answer',message:x.innerText.trim()})))
              window.open('http://localhost:8002/download?text=' + encodeURIComponent(text), '_blank').focus();
            }

            const start = document.querySelector('.start')
            const textarea = document.querySelector('.textarea')
            const result = document.querySelector('.result')
            start.onclick = () => {
              const element = document.createElement('div')
              result.insertAdjacentElement('afterbegin', element)
              element.outerHTML = '<div class="question"><div class="title">'+textarea.value+'</div></div>'
            }
          }
        `,
      }}
    />
    <title>ЕЯЗИС ЛР 6</title>
    <link rel='stylesheet' href='style.css' />

    <h1>ЕЯЗИС. Лабораторная работа №6</h1>
    {/* <h2>Чат.</h2> */}

    <div class='input'>
      <textarea class='textarea' rows={8}>
        The hell is better be there
      </textarea>
    </div>

    <div class='buttons'>
      <button
        class='start'
        hx-post='/update'
        hx-target='.result'
        hx-swap='afterbegin'
        hx-vals={`js:{text:document.querySelector('.textarea').value||' '}`}
      >
        Отправить
      </button>

      <button class='download'>Скачать диалог</button>
    </div>

    <div class='result' />

    <footer>© Шарапов А. С., Лапковский М. A., Войткус С. А.</footer>
  </>
)

const Result = ({ data }: { data: string }) => (
  <div class='entry'>
    <div class='title'>→ {data}</div>
  </div>
)
