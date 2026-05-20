import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  const salvar = useCallback(
    (novo: T | ((anterior: T) => T)) => {
      setValor((anterior) => {
        const resolvido = novo instanceof Function ? novo(anterior) : novo
        try {
          window.localStorage.setItem(key, JSON.stringify(resolvido))
        } catch {
          // localstorage indisponível (modo privado, limite), mantém em memória
        }
        return resolvido
      })
    },
    [key],
  )

  return [valor, salvar] as const
}
