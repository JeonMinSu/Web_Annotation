class Observable
{
    constructor()
    {
        this.observers = [];
    }

    add(obj)
    {
        return this.observers.push(obj);
    }

    notify_observers(...args)
    {
        this.observers.forEach((observer)=>
        {
            observer.notify(this, ...args);
        })
    }
};
  
class Observer
{
    constructor(observable)
    {
        observable.add(this);
    }

    notify(observable, ...args)
    {
        [...args].forEach((arg) => 
        {
            this.notifyFn(arg);
        });
    }

    notifyFn(observable, arg)
    {
        console.log(arg);
    }
}
  
  