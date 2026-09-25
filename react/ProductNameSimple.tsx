import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'productNameSimpleBar',
  'productNameSimpleName',
  'productNameSimplePrices',
  'productNameSimpleListPrice',
  'productNameSimplePrice',
] as const

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function ProductNameSimple() {
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()

  const product = productContextValue?.product
  const selectedItem = productContextValue?.selectedItem
  // sellers[0] é o seller padrão do item (o que define o preço vigente exibido na loja)
  const commertialOffer = selectedItem?.sellers?.[0]?.commertialOffer

  if (!product || !commertialOffer) {
    return null
  }

  const { productName } = product
  const { Price: sellingPrice, ListPrice: listPrice } = commertialOffer

  return (
    <div className={`${handles.productNameSimpleBar} fixed bottom-0 left-0 w-100 bg-base flex items-center justify-between pa4 shadow-4 z-max`}>
      <span className={`${handles.productNameSimpleName} f5 fw6`}>{productName}</span>
      <div className={`${handles.productNameSimplePrices} flex items-center`}>
        <span className={`${handles.productNameSimpleListPrice} strike c-muted-2 mr3 f6`}>
          De: {formatCurrency(listPrice)}
        </span>
        <span className={`${handles.productNameSimplePrice} f4 fw7 c-emphasis`}>
          Por: {formatCurrency(sellingPrice)}
        </span>
      </div>
    </div>
  )
}

export default ProductNameSimple
