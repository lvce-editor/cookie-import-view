import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const selectFieldNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.CookieImportViewField,
  type: VirtualDomElements.Div,
}

export const getSelectField = (id: string, label: string, value: string, icon: readonly VirtualDomNode[] = []): readonly VirtualDomNode[] => {
  const hasIcon = icon.length > 0
  return [
    selectFieldNode,
    {
      childCount: hasIcon ? 2 : 1,
      className: ClassNames.CookieImportViewLabel,
      htmlFor: id,
      type: VirtualDomElements.Label,
    },
    ...icon,
    text(label),
    {
      childCount: 1,
      className: ClassNames.SelectBox,
      id,
      name: id,
      type: VirtualDomElements.Select,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Option,
      value,
    },
    text(value),
  ]
}
