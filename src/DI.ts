import 'reflect-metadata'

const INJECT_KEY = "inject"
const ARGS_KEY = "inject:args"
const TYPE_KEY = "inject:type"

const container: Map<string, Object> = new Map()

const getSingleton = (Clazz: any, args: any[]) => {

  if (container.has(Clazz.name))
    return container.get(Clazz.name)

  const instance = new Clazz(...args)
  container.set(Clazz.name, instance)

  return instance
}

export const Inject = (...args: any[]) => (target: any, key: string) => {
  Reflect.defineMetadata(INJECT_KEY, true, target, key)
  Reflect.defineMetadata(ARGS_KEY, args, target, key)
}

export const Singleton = (...args: any[]) => (target: any) => {
  Reflect.defineMetadata(ARGS_KEY, args, target);
  Reflect.defineMetadata(TYPE_KEY, "singleton", target)
}

export const InjectFields = () => (target: any) => {

  const proxy = new Proxy(target, {
    construct(target, argArray, newTarget) {

      const result = Reflect.construct(target, argArray, newTarget);

      for (let prop of Reflect.ownKeys(result)) {
        if (Reflect.getMetadata(INJECT_KEY, result, prop)) {
          const Clazz = Reflect.getMetadata("design:type", result, prop);

          if (Reflect.getMetadata(TYPE_KEY, Clazz) === "singleton") {
            const args = Reflect.getMetadata(ARGS_KEY, Clazz)
            result[prop] = getSingleton(Clazz, args)
          } else {
            const args = Reflect.getMetadata(ARGS_KEY, result, prop)
            result[prop] = new Clazz(...args)
          }
        }
      }

      return result

    }
  })

  return proxy

}
