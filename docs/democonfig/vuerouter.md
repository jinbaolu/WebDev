# vue-router

## 目录结构

```
├── router
│   ├── index.js
│   ├── routes.js
│   └── utils
│       ├── asyncRouter.js
│       ├── registerInterceptor.js
│       └── scrollBehavior.js
```

## index.js

```javascript
/**
 * 路由权限控制方式：beforeEach | addRoutes | 两者结合
 * 这里封装了 addRoutes 方式，即 resetRoutes 与 filterMapRoutes
 */
import Vue from "vue"
import Router from "vue-router"
import scrollBehavior from "./utils/scrollBehavior"
import routes from "./routes"
import registerInterceptor from "./utils/registerInterceptor"
import { filterAsyncRoutes } from "./utils/asyncRouter"
Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const mode = "hash"
const createRouter = function() {
  const base = mode === "hash" ? "/" : process.env.BASE_URL
  return new Router({ mode, base, scrollBehavior })
}
/**
 * 全局唯一 Router 实例
 */
export const router = createRouter()

/**
 * 路由重置
 * @param {routes} newRoutes
 */
export const resetRoutes = function(newRoutes) {
  router.matcher = createRouter().matcher
  router.addRoutes(newRoutes)
  if (router.app) {
    const { path, query, hash } = router.currentRoute
    router
      .replace({ path, query: { ...query, _resetRoutes: "1" }, hash })
      .then(() => router.replace({ path, query, hash }))
  }
}

/**
 * 路由过滤（过滤出有权限的路由）
 * 需求：根据后台数据动态添加路由和菜单
 * @param {(meta: object, route: routes[0]) => boolean} filterCallback
 * @returns {routes}
 */
// export const filterMapRoutes = function(filterCallback) {
//   const loop = curRoutes =>
//     curRoutes
//       .filter(route => filterCallback(route.meta || {}, route))
//       .map(({ children, ...newRoute }) => {
//         if (children) newRoute.children = loop(children)
//         return newRoute
//       })
//   return loop(routes)
// }

/* 注册路由拦截器 */
registerInterceptor(router)

/* 初始化公共路由（相当于路由白名单） */
// resetRoutes(
//   filterMapRoutes(meta => {
//     return meta.roles === undefined || meta.roles.length === 0 // 如何处理路由权限因项目而异...
//   }),
// )

resetRoutes(filterAsyncRoutes(routes))
export default router
```

## routes.js

```javascript
/* 动态 path 匹配例子：https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js */

import router from "@/router"

// 登录页
const Login = () => import(/* webpackChunkName: "Login" */ "@/views/login")
// 注册页
const Register = () =>
  import(/* webpackChunkName: "Register" */ "@/views/register")
// 功能页入口
const Index = () => import(/* webpackChunkName: "Index" */ "@/views/index.vue")
// 功能页-首页
const Home = () => import(/* webpackChunkName: "Home" */ "@/views/home")

/**
 * @type {import('vue-router').RouteConfig[]}
 */
export const routes = [
  {
    path: "/index",
    component: Index,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        meta: { title: "首页" },
        component: Home,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "注册账号" },
    component: Register,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/*",
    name: "404",
    meta: { title: "404" },
    component: () =>
      import(/* webpackChunkName: "error_404" */ "@/views/other/404.vue"),
  },
]

/**
 * 设置开发环境中特有路由
 */
if (process.env.VUE_APP_ENV === "dev" || process.env.VUE_APP_ENV === "stage") {
  routes.unshift({
    path: "/test",
    name: "test",
    meta: { title: "开发测试页面" },
    component: () => import("@/views/other/test.vue"),
    beforeEnter(to, from, next) {
      if (from.matched.length === 0 && from.path === "/") {
        next()
        return
      }
      next(false)
      window.open(router.resolve(to.fullPath).href)
    },
  })
}

export default routes
```

## asyncRouter.js

```javascript
/**
 * 异步路由配置方法（根据用户权限roles）
 */

/* 判断当前角色是否有访问权限，没有roles的默认为可访问，有roles则根据roles表来配置路由 */
const hasPermission = function(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/* 递归过滤异步路由表，筛选角色权限路由 */
export const filterAsyncRoutes = function(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 路由重置
 * @param {routes} newRoutes
 */
// export const resetRoutes = function(newRoutes) {
//   router.matcher = createRouter().matcher
//   router.addRoutes(newRoutes)
//   if (router.app) {
//     const { path, query, hash } = router.currentRoute
//     router
//       .replace({ path, query: { ...query, _resetRoutes: '1' }, hash })
//       .then(() => router.replace({ path, query, hash }))
//   }
// }
```

## registerInterceptor.js

```javascript
/**
 * @param {import('vue-router').default} router
 */
// import store from '@/store'
// import { filterAsyncRoutes } from './asyncRouter.js'
// import routes from '../routes'

export default function(router) {
  if (router._registerInterceptor) return
  router._registerInterceptor = true

  /* 页面标题处理 */
  router.afterEach((to) => {
    let { title } = to.meta
    title = typeof title === "function" ? title(to) : title
    if (title) {
      document.title = title + " · 5G消息交易管理平台"
    }
  })

  /* 导航守卫：通过白名单页面不需要token */
  router.beforeEach((to, from, next) => {
    const whiteList = ["/login", "/register"]
    if (whiteList.indexOf(to.path) === -1) {
      // 非登录注册页
      if (!localStorage.token && localStorage.token !== "") {
        next({ path: `/login?redirect=${to.path}` })
      } else {
        // CSP用户无法访问“开发者模式”
        if (sessionStorage.getItem("csp") == 1 && to.path === "/developer") {
          next(false)
        } else {
          next()
        }
      }
    } else {
      next()
    }
  })

  /* 导航守卫：通过用户角色 */
  // router.beforeEach(async (to, from, next) => {
  //   // 获取用户登录的token
  //   // const hasToken = getToken()
  //   const hasToken = '123'
  //   const whiteList = ['/login', '/register']
  //   // 判断当前用户是否登录
  //   if (hasToken) {
  //     if (to.path === '/login') {
  //       next()
  //     } else {
  //       // 从store中获取用户角色
  //       const hasRoles =
  //         store.state.user.userInfo.roles &&
  //         store.state.user.userInfo.roles.length > 0
  //       if (hasRoles) {
  //         next()
  //       } else {
  //         try {
  //           // 获取用户角色，在userRoles中发请求获取
  //           const roles = await store.getters['user/userRoles']
  //           // 通过用户角色，获取到角色路由表
  //           const accessRoutes = filterAsyncRoutes(routes, roles)
  //           // 动态添加路由到router内
  //           router.addRoutes(accessRoutes)
  //           next({ ...to, replace: true })
  //         } catch (error) {
  //           // 清除用户登录信息后，回跳到登录页去
  //           next(`/login?redirect=${to.path}`)
  //         }
  //       }
  //     }
  //   } else {
  //     // 用户未登录
  //     if (whiteList.indexOf(to.path) !== -1) {
  //       // 需要跳转的路由是否是whiteList中的路由，若是，则直接跳转
  //       next()
  //     } else {
  //       // 需要跳转的路由不是whiteList中的路由，直接跳转到登录页
  //       next(`/login?redirect=${to.path}`)
  //     }
  //   }
  // })
}
```

## scrollBehavior.js

```javascript
/**
 * @type {import('vue-router').RouterOptions['scrollBehavior']}
 */
export default function(to, from, savedPosition) {
  if (to.path !== from.path) {
    if (savedPosition) {
      return savedPosition
    } else {
      // app.vue里面元素
      if (document.getElementById("viewer-wrapper")) {
        document.getElementById("viewer-wrapper").scrollTop = 0
      }
      return { x: 0, y: 0 }
    }
    // if (to.hash) return { selector: to.hash }
  }
}
```
