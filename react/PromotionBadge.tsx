import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['promotionBadge'] as const

function PromotionBadge() {
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()

  const selectedItem = productContextValue?.selectedItem
  // sellers[0] é o seller padrão do item (o que define o preço vigente exibido na loja)
  const commertialOffer = selectedItem?.sellers?.[0]?.commertialOffer

  const listPrice = commertialOffer?.ListPrice
  const sellingPrice = commertialOffer?.Price

  // Todo produto no catálogo tem ListPrice preenchido; só é "promoção" de fato
  // quando o de-por é maior que o preço de venda.
  const hasPromotion = Boolean(listPrice) && listPrice > sellingPrice

  if (!hasPromotion) {
    return null
  }

  return (
    <div className={`${handles.promotionBadge} bg-red c-on-base br2 pv1 ph3 dib f7 fw7 ttu`}>
      Promoção
    </div>
  )
}

export default PromotionBadge
