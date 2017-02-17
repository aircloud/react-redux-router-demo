深入redux技术栈

>这一篇是接上一篇“react进阶漫谈”的第二篇，这一篇主要分析redux的思想和应用，同样参考了网络上的大量资料，但代码同样都是自己尝试实践所得，在这里分享出来，仅供一起学习(上一篇地址:[个人博客](http://aircloud.10000h.top/61)／[segmentFault](https://segmentfault.com/a/1190000008356407?_ea=1628613))

注：本文中的所有示例代码，已经合成一个小的demo放在了[这里](https://github.com/aircloud/react-redux-router-demo)，如果你认为这个demo对你的学习起到了一点帮助，请给star以支持。

### redux 简介

本文默认大家掌握一些react和flux架构的相关知识，也用过或者了解过redux，所以并不会从最基础的讲起，而是直接对redux进行总结。如果没有用过redux，最好可以先看[这里](http://cn.redux.js.org/index.html)

想要理解redux，我们首先要总结redux的一些设计原则：

* 单一数据源

Redux中只有用单一个对象大树结构来的存储整个应用的状态，也就是整个应用中会用到的数据，称之为store(存储)。store除了存储的数据，还可以存储整个应用的状态（包括router状态，后文有介绍），所以，通过store，实现一个对整个应用的即时保存功能(建立快照)变为可能，另外这种设计也为服务端渲染提供了可能。

* 状态是只读的

这一点符合flux的设计理念，我们并不能在components里面更改store的状态（实际上redux会根据reducer生成store)，而是只能通过dispatch，触发action对当前状态进行迭代，这里我们也并没有直接修改应用的状态，而是返回了一份全新的状态。

* 状态修改均由纯函数构成

Redux中的reducer的原型会长得像下面这样，你可以把它当作就是 之前的状态 + 动作 = 新的状态 的公式:

```
(previousState, action) => newState
```

每一个reducer都是纯函数，这意味着它没有任何副作用，这种设计的好处不仅在于用reducer对状态修改变的简单，纯粹可以测试，另外，redux可以保存各个返回状态从而方便地生成时间旅行，跟踪每一次因为出发action而导致变更的结果。

我们如果在react中使用redux，同时需要react-redux 和 redux。

### redux 架构与源码分析

这一部分主要谈一点自己的理解，可能有些抽象，也可能不完全正确，可直接跳过。

#### createStore

redux中核心的方法是createStore，react的核心功能全都覆盖在createStore和其最终生成的store中，createStore方法本身支持传入reducer、initialState、enhancer三参数，enhancer可以作为增强的包装函数，这个我们并不是十分常用。

这个函数内部维护了一个currentState，并且这个currentState可以通过getState函数(内置)返回，另外本身实际上是实现了一个发布-订阅模式，通过store.subscribe来订阅事件，这个工作由`react-redux`来帮助我们隐式完成，这是为了在有dispatch的时候触发所有监听从而更新整个状态树。另外，内置的dispatch函数在经过一系列校验后，触发reducer，之后state被更改，之后依次调用监听，完成整个状态树的更新。

#### middleWare

用过redux的朋友实际上都对于`redux-thunk`等中间件并不陌生，实际上很多时候这是不可缺少的，redux对middleWare也有很好的支持，这种理念我认为和nodejs的中间件机制有些类似：action依次经过各个middleWare然后传给下一个，每一个middleWare也可以进行另外的操作比如中断或者改变action，知道最终的处理函数交给reducer。

redux的applyMiddleware函数非常精炼：

```
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
      //注意这里的dispatch并不是一开始的store.dispatch，实际上是变化了的
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

核心是`dispatch = compose(...chain)(store.dispatch)`，这句话是对于各个中间件的链式调用，其中compose的源代码：

```
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}
```
调用上一个函数的执行结果给下一个函数。

实际上我们要写一个middleware的过程也非常简单，比如redux-trunk实际上就这点内容：

```
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

### redux 与路由

当然，我们首先声明react工具集的`react-router`并不一定必须搭配redux使用，只是redux另外有一个`react-router-redux`可以搭配`react-router`以及redux使用，效果非常好。

因为我们这部分并不是介绍`react-router`怎么使用的，关于`react-router`的用法请参考[中文文档](https://react-guide.github.io/react-router-cn/index.html)。

#### react-router的特性

* 允许开发者通过JSX标签来声明路由，这一点让我们路由写起来十分友好，并且声明式路由的表述能力比较强。
* 嵌套路由以及路由匹配：可以在指定的path中传递参数:

```
<Route path="/mail/:mailId" component={Mail} />
```
另外如果参数是可选的，我们通过括号包起来即可(:可选参数)。   

* 支持多种路由切换方式：我们知道现在的路由切换方式无外乎使用hashchange和pushState，前者有比较好的浏览器兼容性，但是却并不像一个真正的url，而后者给我们提供优雅的url体验，但是却需要服务端解决任意路径刷新的问题(服务端要自动重定向到首页)。

#### 为什么需要react-router-redux

简单的说，`react-router-redux`让我们可以把路由也当作状态的一部分，并且可以使用redux的方式改变路由：直接调用dispatch：`this.props.push(“/detail/”);`，这样把路由也当作一个全局状态，路由状态也是应用状态的一部分，这样可能更有利于前端状态管理。

`react-router-redux`是需要配合`react-router`来使用的，并不能单独使用，在原本的项目中添加上`react-router-redux`也不复杂：

```
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import ThunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import DevTools from './DevTools';

const finalCreateStore = compose(
  applyMiddleware(ThunkMiddleware,routerMiddleware(hashHistory)),
  DevTools.instrument()
)(createStore);

console.log("rootReducer",rootReducer);

const reducer = combineReducers({
  rootReducer,
  routing: routerReducer,
});

export default function configureStore(initialState) {
  const store = finalCreateStore(reducer, initialState);
  return store;
}
```

另外，上文提到的demo`react-router-redux-demo`用了`react-router`和`react-router-redux`，当然也用到了redux的一些别的比较好的工作，比如`redux-devtools`，有兴趣的朋友可以点击[这里](https://github.com/aircloud/react-redux-router-demo)

### redux 与组件

这一部分讲述的是一种组件书写规范，并不是一些库或者架构，这些规范有利于我们在复杂的项目中组织页面，不至于混乱。

从布局的角度看，redux强调了三种不同的布局组件，Layouts，Views，Components：

* Layouts: 指的是页面布局组件，描述了页面的基本结构，可以是无状态函数，一般就直接设置在最外层router的component参数中，并不承担和redux直接交互的功能。比如我项目中的Layouts组件：

```
const Frame = (props) =>
       <div className="frame">
           <div className="header">
               <Nav />
           </div>
           <div className="container">
               {props.children}
           </div>
       </div>;
```

* Views组件，我认为这个组件是Components的高阶组件或者Components group，这一层是可以和redux进行交互并且处理数据的，我们可以将一个整体性功能的组件组放在一个Views下面(注：由于我给出的demo十分简单，因此Views层和Components层分的不是那么开)
* Components组件，这是末级渲染组件，一般来说，这一层级的组件的数据通过props传入，不直接和redux单向数据流产生交互，可以是木偶般的无状态组件，或者是包含自身少量交互和状态的组件，这一层级的组件可以被大量复用。

总而言之，遵守这套规范并不是强制性的，但是项目一旦稍微复杂一些，这样做的好处就可以充分彰显出来。

### redux 与表单

redux的单向数据流相对于双向数据绑定，在处理表单等问题上的确有点力不从心，但是幸运的是已经开源了有几个比较不错的插件：

* [redux-form-utils](https://github.com/jasonslyvia/redux-form-utils)，好吧，这个插件的star数目非常少，但是他比较简单，源代码也比较短，只有200多行，所以这是一个值得我们看源码学习的插件(它的源码结构也非常简单，就是先定一个一个高阶组件，这个高阶组件可以给我们自己定义的表单组件传入新的props，定制组件，后一部分就是定义了一些action和reducer，负责在内容变化的时候通知改变状态树)，但是缺憾就是这个插件没有对表单验证做工作，所以如果我们需要表单验证，还是需要自己做一些工作的。
	* 另外还有一地方，这个插件源代码写法中用到了`::`这种ES6的语法，这其实是一种在es6中class内部，使用babel-preset-stage-0即可使用的语法糖：`::this.[functionName] 等价于 this.[functionName].bind(this, args?)  `
* [redux-form](http://redux-form.com/)，这个插件功能复杂，代码完善，体量也非常庞大，可以参考文档进行使用，但是读懂源代码就是比较麻烦的事情了。不过这个插件需要在redux的应用的state下挂载一个节点，这个节点是不需要开发者自己来操控的，他唯一需要做的事情就是写一个submit函数即可。我在自己的demo中也把一个例子稍加改动搬了过来，感觉用起来比较舒服。

### redux 性能优化

想要做到redux性能优化，我们首先就要知道redux的性能可能会在哪些地方受到影响，否则没有目标是没有办法性能优化的。

因为我也不是使用redux的老手，所以也并不能覆盖所有性能优化的点，我总结两点：

* 有的时候，我们需要的数据格式会自带冗余，可以抽取出一些公共的部分从而缩减大小，比如我们需要的数据格式可能是这样的：

```
[
	{
		name:"Nike",
		title:"国家一级运动员","国家一级裁判员"
	}
	{
		name:"Jenny",
		title:"国家一级裁判员"
	}
	{
		name:"Mark",
		title:"国家一级运动员"
	}
]
```

这个时候实际上我们可以优化成这样:

```
[
	{
	"国家一级运动员":"Nike","Mark"
	"国家一级裁判员":"Jenny","Nike"
	}
]
```
这个时候，我们可以直接把后者当作store的格式，而我们用[reselect](https://github.com/reactjs/reselect)这个库再转变成我们所要的格式，关于reselect怎么用上述链接有更详细的例子，在这里我就不过多介绍了。

* 事实上，对于redux来说，每当store发生改变的时候，所有的connect都会重新计算，在一个大型应用中，浪费的时间可想而知，为了减少性能浪费，我们可以对connect中的selector做缓存。

上文提到的reselect库自带了缓存特性，我们可以通过比较参数来确定是否使用缓存，这里用了纯函数的特性。

reselect的缓存函数可以用户自定义，具体可以参考上文github链接的readme。


