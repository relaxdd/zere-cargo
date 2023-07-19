function useModal() {
  const $close = document.querySelector('.zc_modal__block-close-button')
  const $open = document.querySelector('.zc_button input[type="button"]')

  if (!$close || !$open) return

  function getElements() {
    const $html = document.querySelector<HTMLElement>('html')
    const $modal = document.querySelector<HTMLElement>('.zc_modal')

    return [$html, $modal] as const
  }

  function closeHandler() {
    const [$html, $modal] = getElements()
    if (!$modal) return

    $html!.classList.remove('zc_modal__show')
    $modal.classList.remove('zc_modal__active')

    setTimeout(() => {
      $modal.style.removeProperty('display')
    }, 300)
  }

  function openHandler() {
    const [$html, $modal] = getElements()
    if (!$modal) return

    $html!.classList.add('zc_modal__show')
    $modal.style.setProperty('display', 'block')

    setTimeout(() => {
      $modal.classList.add('zc_modal__active')
    }, 0)
  }

  $close.addEventListener('click', closeHandler)
  $open.addEventListener('click', openHandler)
}

function main() {
  useModal()
}

window.addEventListener('load', main)