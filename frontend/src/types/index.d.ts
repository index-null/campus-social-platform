/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 @vueuse/core 的类型
declare module '@vueuse/core' {
  export function useDark(): Ref<boolean>
  export function useToggle(value: Ref<boolean>): () => boolean
} 