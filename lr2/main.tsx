/** @jsxImportSource npm:preact@10.20.2 */
import vixeny from 'https://deno.land/x/endofunctor@v0.0.945/fun.ts'
import { render } from 'npm:preact-render-to-string'

Deno.serve(
  vixeny()([
    { path: '/style.css', f: () => Deno.readFileSync('style.css') },
    {
      path: '/',
      type: 'response',
      r: () => new Response(render(App), { headers: { 'content-type': 'text/html; charset=utf-8' } }),
    },
    {
      path: '/update',
      method: 'POST',
      type: 'response',
      r: async r => {
        const data = (await (await fetch('http://127.0.0.1:8030/api/v1/lr2', r)).json()) as Data
        return new Response(render(<Result data={data} />), { headers: { 'content-type': 'text/html; charset=utf-8' } })
      },
    },
  ])
)

const App = (
  <>
    <script src='https://unpkg.com/htmx.org@1.9.12'></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          onload = () => {
            const textarea = document.querySelector('.textarea')
            const placeholder = document.querySelector('.placeholder')
            textarea.oninput = e => {
              placeholder.innerHTML = e.currentTarget.value.replace(/(\\w+|[^\\w\\s])/g, '<span data-item="$1">$1</span>') + '<span>.</span>'
              setTimeout(() => placeholder.scrollTop = textarea.scrollTop)
            }
            textarea.onscroll = e => placeholder.scrollTop = textarea.scrollTop
            placeholder.onscroll = e => textarea.scrollTop = placeholder.scrollTop
            placeholder.onclick = e => textarea.click(e)
          }
        `,
      }}
    />
    <title>ЕЯЗИС ЛР 2</title>
    <link rel='stylesheet' href='style.css' />

    <h1>ЕЯЗИС. Лабораторная работа №2</h1>
    {/* <h2>Чат.</h2> */}

    <div class='input'>
      <textarea
        class='textarea'
        hx-post='/update'
        hx-trigger='input'
        hx-target='.result'
        hx-swap='innerHTML'
        hx-vals={`js:{text:document.querySelector('.textarea').value||' '}`}
        rows={8}
        contentEditable
      >
        The hell is better be there
      </textarea>

      <div class='placeholder' />
    </div>

    <div class='buttons'>
      <button
        class='start'
        hx-post='/update'
        hx-target='.result'
        hx-swap='innerHTML'
        hx-vals={`js:{text:document.querySelector('.textarea').value||' '}`}
      >
        Запустить
      </button>
      {/* @ts-ignore */}
      <button class='start' popovertarget='help'>
        Помощь
      </button>

      <button class='alt'>Загрузить</button>

      <button class='alt'>Сохранить</button>
    </div>

    <div class='result' />

    {/* @ts-ignore */}
    <div id='help' popover>
      <h2>Помощь</h2>
      <p>
        В верху страницы находится текстовое поле. В это текстовое поле можно вводить через пробел слова. По каждому
        введённому слову будет произведён поиск его вхождения в исходном тексте. Результат будет выведен в таблицу ниже,
        где можно посмотреть часть речи слова, количество его вхождения, и контекст его использования.
      </p>
      <p>
        Результат пересчитывается автоматически при вводе текста в текстовое поле, однако можно и запустить пересчёт
        вручную, нажав на кнопку "Запустить".
      </p>
    </div>

    <footer>© Шарапов А. С., Лапковский М. A., Войткус С. А.</footer>
  </>
)

type Data = Record<
  string,
  { count: number; morpheme: string; type: string; entries: { before: string; after: string; position: number }[] }
>
const Result = ({ data }: { data: Data }) => (
  <>
    {Object.keys(data).length ? (
      <div class='head'>
        <div>#</div>
        <div>Морфема</div>
        <div>Количество</div>
        <div>Часть речи</div>
      </div>
    ) : null}
    {Object.values(data).map(({ type, morpheme, count, entries }, index) => (
      <div>
        <div class='entry' data-item={morpheme} tabIndex={0}>
          <div>{index}</div>
          <div>{morpheme}</div>
          <div>{count}</div>
          <div>{type}</div>
        </div>

        <div class='matches'>
          <div class='matchHeader'>
            <span>Позиция</span>
            <span>Контекст</span>
          </div>

          {entries.map(entry => (
            <div class='match'>
              <span class='position'>{entry.position}</span>
              <span class='before'>...{entry.before.replaceAll(' .', '.')}</span>
              <span class='morpheme'>{morpheme}</span>
              <span class='after'>{entry.after.replaceAll(' .', '.')}...</span>
            </div>
          ))}
        </div>
      </div>
    ))}
    <style
      dangerouslySetInnerHTML={{
        __html:
          Object.keys(data)
            .map(x => `body:has([data-item='${x}']:hover) [data-item='${x}']`)
            .join() +
          `{
            border-color: #bed9b5;
            background-color: #00c50012;
            cursor: default;
            box-shadow: 0.1rem 0.1rem 0.6rem #0000000f;
            color: #61b146;
          }`,
      }}
    />
  </>
)
