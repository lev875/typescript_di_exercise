import { Inject, InjectFields, Singleton } from "./DI.js";

export class InjectableClass {

  constructor(num: number, str: string) {
    this.num = num
    this.str = str
  }

  num: number

  str: string

  public publicMethod() {
    return `${this.str}_${this.num}`
  }

}

@Singleton('Hello from singleton')
export class SingletonClass {

  constructor(str: string) {
    console.log('Singleton initialized')
    this.str = str
  }

  str: string

  public publicMethod() {
    return this.str
  }

}

@InjectFields()
export class SomeClass {

  @Inject(1337, 'Injected1')
  private firstInjected?: InjectableClass

  @Inject(123, 'Injected2')
  private secondInjected?: InjectableClass

  @Inject()
  private injectedSingleton?: SingletonClass

  public someMethod() {
    console.log(`SomeClass:First injected: ${this.firstInjected?.publicMethod()}`)
    console.log(`SomeClass:Second injected: ${this.secondInjected?.publicMethod()}`)
    console.log(`SomeClass:Singleton: ${this.injectedSingleton?.publicMethod()}`)
  }

}

@InjectFields()
export class OtherClass {

  @Inject()
  private injectedSingleton?: SingletonClass;

  public someMethod() {
    console.log(`OtherClass:Singleton: ${this.injectedSingleton?.publicMethod()}`)
  }

}

const some = new SomeClass()
const other = new OtherClass()

some.someMethod()
other.someMethod()
