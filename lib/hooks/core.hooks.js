import {
  useState,
  useEffect,
} from 'react'

export {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

export function useStore(store, key = '*') {
  const { state } = store
  const [v, setState] = useState(null)
  const update = () => setState(+new Date())
  useEffect(() => {
    store.watch(key, update)
    return () => store.unwatch(key, update)
  }, [state])
  return state
}

export function useModel(model, key) {
  return useStore(model, key)
}

export function useDepository(depo, key, params = {}) {
  const value = depo.get(key, params)
  const [v, set] = useState(value)
  const update = (v) => set(v)
  useEffect(() => {
    depo.subscribe(key, update)
    return () => depo.unsubscribe(key, update)
  }, [v])
  const setParams = (params) => depo.request(key, params)
  return [v, setParams]
}
