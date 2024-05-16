/** @jsxImportSource npm:preact@10.20.2 */
import vixeny from 'https://deno.land/x/endofunctor@v0.0.945/fun.ts'
import { render } from 'npm:preact-render-to-string'

Deno.serve({
  port: 8001,
  handler: vixeny()([
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
        const data = (await r.formData()).get('text')!.toString()
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
    <title>ЕЯЗИС ЛР 3</title>
    <link rel='stylesheet' href='style.css' />

    <h1>ЕЯЗИС. Лабораторная работа №3</h1>
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

      <button class='alt'>Загрузить</button>

      <button class='alt'>Сохранить</button>
    </div>

    <div class='result' />

    <div class='help'>
      <div class='row'>
        <span>CC</span> <span>союз</span>
      </div>
      <div class='row'>
        <span>CD</span> <span>кардинальное число</span>
      </div>
      <div class='row'>
        <span>DT</span> <span>определитель</span>
      </div>
      <div class='row'>
        <span>EX</span> <span>существование там</span>
      </div>
      <div class='row'>
        <span>FW</span> <span>иностранное слово</span>
      </div>
      <div class='row'>
        <span>IN</span> <span>предлог/подчинительный союз</span>
      </div>
      <div class='row'>
        <span>JJ</span> <span>прилагательное</span>
      </div>
      <div class='row'>
        <span>VP</span> <span>глагольная группа</span>
      </div>
      <div class='row'>
        <span>JJR</span> <span>прилагательное, сравнительная степень</span>
      </div>
      <div class='row'>
        <span>JJS</span> <span>прилагательное, превосходная степень</span>
      </div>
      <div class='row'>
        <span>LS</span> <span>маркер списка 1)</span>
      </div>
      <div class='row'>
        <span>MD</span> <span>модальный глагол сосотавное сказуемое</span>
      </div>
      <div class='row'>
        <span>NN</span> <span>существительное, единственное число</span>
      </div>
      <div class='row'>
        <span>NNS</span> <span>существительное, множественное число</span>
      </div>
      <div class='row'>
        <span>PP</span> <span>предложная группа</span>
      </div>
      <div class='row'>
        <span>NNP</span> <span>имя собственное, единственное число</span>
      </div>
      <div class='row'>
        <span>NNPS</span> <span>имя собственное, множественное число</span>
      </div>
      <div class='row'>
        <span>PDT</span> <span>предопределитель</span>
      </div>
      <div class='row'>
        <span>POS</span> <span>притяжательное окончание</span>
      </div>
      <div class='row'>
        <span>PRP</span> <span>личное местоимение</span>
      </div>
      <div class='row'>
        <span>PRP</span> <span> притяжательное местоимение</span>
      </div>
      <div class='row'>
        <span>RB</span> <span>наречие</span>
      </div>
      <div class='row'>
        <span>RBR</span> <span>наречие, сравнительная степень</span>
      </div>
      <div class='row'>
        <span>RBS</span> <span>наречие, превосходная степень</span>
      </div>
      <div class='row'>
        <span>RP</span> <span>частица</span>
      </div>
      <div class='row'>
        <span>S</span> <span>Простое повествовательное предложение</span>
      </div>
      <div class='row'>
        <span>SBAR</span> <span>Предложение, введенное (возможно пустым) подчинительным союзом</span>
      </div>
      <div class='row'>
        <span>SBARQ</span> <span>Прямой вопрос, введенный вопросительным словом или вопросительной группой</span>
      </div>
      <div class='row'>
        <span>SINV</span> <span>Инвертированное повествовательное предложение</span>
      </div>
      <div class='row'>
        <span>SQ</span>{' '}
        <span>
          Инвертированный вопрос да/нет, или главное предложение вопроса, следующее за вопросительной группой в SBARQ
        </span>
      </div>
      <div class='row'>
        <span>SYM</span> <span>Символ</span>
      </div>
      <div class='row'>
        <span>VBD</span> <span>глагол, прошедшее время</span>
      </div>
      <div class='row'>
        <span>VBG</span> <span>глагол, герундий/презенс-партицип берущий</span>
      </div>
      <div class='row'>
        <span>VBN</span> <span>глагол, прошедшее причастие взятый</span>
      </div>
      <div class='row'>
        <span>VBP</span> <span>глагол, настоящее время, ед. число, не 3-е лицо</span>
      </div>
      <div class='row'>
        <span>VBZ</span> <span>глагол, настоящее время, 3-е лицо, ед. число</span>
      </div>
      <div class='row'>
        <span>WDT</span> <span>вопросительный определитель</span>
      </div>
      <div class='row'>
        <span>WP</span> <span>вопросительное местоимение</span>
      </div>
      <div class='row'>
        <span>WP</span> <span> притяжательное вопросительное местоимение</span>
      </div>
      <div class='row'>
        <span>WRB</span> <span>вопросительное наречие</span>
      </div>
      <div class='row'>
        <span>TO</span> <span>to</span>
      </div>
      <div class='row'>
        <span>UH</span> <span>междометие</span>
      </div>
      <div class='row'>
        <span>VB</span> <span>глагол, исходная форма</span>
      </div>
    </div>

    <footer>© Шарапов А. С., Лапковский М. A., Войткус С. А.</footer>
  </>
)

const Result = ({ data }: { data: string }) => (
  <>
    {data.split(/[.]/).map(
      sentence =>
        sentence.trim() && (
          <div class='entry'>
            <div class='title'>→ {sentence.trim()}</div>
            <img
              class='image'
              src={`http://localhost:8030/api/v1/lr3/tree?text=${sentence}&line_color=%23929292&leaf_color=%2347a827&node_color=%232382e2`}
            />
          </div>
        )
    )}
  </>
)
