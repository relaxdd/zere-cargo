type HE = HTMLElement
type HFE = HTMLFormElement

function useModals(list: string[]) {
  function closeHandler(e: Event) {
    const $modal = (e.currentTarget as HE).closest<HE>('.zc_modal')
    const $html = document.querySelector<HE>('html')!

    if (!$modal) return

    $html!.classList.remove('zc_modal__show')
    $modal.classList.remove('zc_modal__active')

    setTimeout(() => {
      $modal.style.removeProperty('display')
    }, 300)
  }

  function openHandler(e: Event) {
    const id = (e.currentTarget as HE).dataset?.['modal']
    if (!id) return

    const $html = document.querySelector<HE>('html')!
    const $modal = document.querySelector<HE>(`#${id}.zc_modal`)

    if (!$modal) return

    $html!.classList.add('zc_modal__show')
    $modal.style.setProperty('display', 'block')

    setTimeout(() => {
      $modal.classList.add('zc_modal__active')
    }, 0)
  }

  list.forEach(it => {
    const $modal = document.querySelector(`#${it}.zc_modal`)
    if (!$modal) return

    const $close = $modal.querySelector('.zc_modal__block-close-button')
    if ($close) $close.addEventListener('click', closeHandler)

    const $btn = document.querySelector(`[data-modal="${it}"]`)
    if ($btn) $btn.addEventListener('click', openHandler)
  })
}

function copyAddress() {
  async function clickHandler(e: Event) {
    try {
      const text = '浙江省-金华市-义乌市-苏溪镇-义北工业园区祥和路1号 14-786库房电话:18905897786'
      await window.navigator.clipboard.writeText(text)
      alert('Текст скопирован!')
    } catch (e) {
      console.error(e)
    }
  }

  const $btn = document.querySelector('#copy-address')
  if ($btn) $btn.addEventListener('click', clickHandler)
}

function checkContentType(headers: Headers) {
  return headers.get('Content-Type')?.includes('application/json')
}

function validateJSON(json: string) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return false
  }
}

function deleteTrack() {
  const $items = document.querySelectorAll('.zc-delete-item')

  async function deleteElement(id: string) {
    const url = '/lk/api/index.php?action=delete-track&id=' + id
    const resp = await fetch(url, { method: 'GET' })
    const text = await resp.text()

    if (!resp.ok || !checkContentType(resp.headers))
      throw new Error(text)

    const data = validateJSON(text)

    if (data === false)
      throw new Error(text)

    console.log(data)
  }

  async function clickHandler(e: Event) {
    const id = (e.currentTarget as HTMLElement).dataset?.['itemId']
    if (!id) return

    const msg = 'Вы уверены что хотите удалить этот элемент?'

    const agree = window.confirm(msg)
    if (!agree) return

    try {
      await deleteElement(id)
    } catch (err) {
      console.error(err)
    }
  }

  $items.forEach(($it) => {
    $it.addEventListener('click', clickHandler)
  })
}

function createTrack() {
  const $form = document.querySelector<HFE>('form#create-track')
  if (!$form) return

  async function submitHandler(e: SubmitEvent) {
    e.preventDefault()

    const url = '/lk/api/index.php?action=create-track'
    const body = new FormData($form!)

    const resp = await fetch(url, { method: 'POST', body })
    const text = await resp.text()

    if (!resp.ok || !checkContentType(resp.headers))
      throw new Error(text)

    const data = validateJSON(text)

    if (data === false)
      throw new Error(text)

    console.log(data)
  }

  $form.addEventListener('submit', submitHandler)
}

function main() {
  copyAddress()
  deleteTrack()
  createTrack()

  useModals(['add-track-modal', 'example-modal'])
}

window.addEventListener('load', main)