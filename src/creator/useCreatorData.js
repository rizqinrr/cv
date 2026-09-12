import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  CREATOR_STORAGE_KEY,
  createInitialCv,
  normalizeCv,
} from './creatorSchema.js'

const SAVE_DEBOUNCE_MS = 500

function moveItem(list, from, to) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      const { path, value } = action
      if (path.length === 1) return { ...state, [path[0]]: value }
      const [group, key] = path
      return { ...state, [group]: { ...state[group], [key]: value } }
    }

    case 'SET_LIST_ITEM': {
      const { list, index, key, value } = action
      const next = state[list].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      )
      return { ...state, [list]: next }
    }

    case 'SET_BULLETS': {
      const { list, index, text } = action
      const bullets = text.split('\n')
      const next = state[list].map((item, i) =>
        i === index ? { ...item, bullets } : item,
      )
      return { ...state, [list]: next }
    }

    case 'ADD_ITEM': {
      const { list, template } = action
      return { ...state, [list]: [...state[list], template] }
    }

    case 'REMOVE_ITEM': {
      const { list, index } = action
      if (state[list].length <= 1 && list !== 'academicProjects') return state
      return { ...state, [list]: state[list].filter((_, i) => i !== index) }
    }

    case 'MOVE_ITEM': {
      const { list, index, direction } = action
      return {
        ...state,
        [list]: moveItem(state[list], index, index + direction),
      }
    }

    case 'REPLACE':
      return normalizeCv(action.data)

    default:
      return state
  }
}

function loadInitialState() {
  if (typeof window === 'undefined') return createInitialCv()
  try {
    const stored = window.localStorage.getItem(CREATOR_STORAGE_KEY)
    if (!stored) return createInitialCv()
    return normalizeCv(JSON.parse(stored))
  } catch {
    return createInitialCv()
  }
}

export function useCreatorData() {
  const [cv, dispatch] = useReducer(reducer, undefined, loadInitialState)
  const [savedAt, setSavedAt] = useState(null)
  const [saveError, setSaveError] = useState('')
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return undefined
    }

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(cv))
        setSavedAt(Date.now())
        setSaveError('')
      } catch {
        setSaveError('Gagal menyimpan ke penyimpanan browser.')
      }
    }, SAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [cv])

  const setField = useCallback((path, value) => {
    dispatch({ type: 'SET_FIELD', path, value })
  }, [])

  const setListItem = useCallback((list, index, key, value) => {
    dispatch({ type: 'SET_LIST_ITEM', list, index, key, value })
  }, [])

  const setBullets = useCallback((list, index, text) => {
    dispatch({ type: 'SET_BULLETS', list, index, text })
  }, [])

  const addItem = useCallback((list, template) => {
    dispatch({ type: 'ADD_ITEM', list, template })
  }, [])

  const removeItem = useCallback((list, index) => {
    dispatch({ type: 'REMOVE_ITEM', list, index })
  }, [])

  const moveItemBy = useCallback((list, index, direction) => {
    dispatch({ type: 'MOVE_ITEM', list, index, direction })
  }, [])

  const reset = useCallback(() => {
    const fresh = createInitialCv()
    dispatch({ type: 'REPLACE', data: fresh })
    try {
      window.localStorage.removeItem(CREATOR_STORAGE_KEY)
    } catch {
      // abaikan, state sudah diganti
    }
  }, [])

  const actions = useMemo(
    () => ({ setField, setListItem, setBullets, addItem, removeItem, moveItemBy, reset }),
    [setField, setListItem, setBullets, addItem, removeItem, moveItemBy, reset],
  )

  return { cv, actions, savedAt, saveError }
}
