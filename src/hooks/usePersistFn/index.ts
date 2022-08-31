import { useRef } from 'react';

export type noop = (...args: any[]) => any;

function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  // 每次渲染fn的最新值都会记录在fnRef中
  fnRef.current = fn;

  const persistFn = useRef<T>();
  // 初次渲染时给persistFn赋值，此后persistFn不会更新
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      return fnRef.current!.apply(this as any, args);
    } as T;
  }

  // 返回persistFn，感叹号表示返回值类型非null或undefined，因为初次渲染时persistFn就被赋值为了函数
  return persistFn.current!;
}

export default usePersistFn;