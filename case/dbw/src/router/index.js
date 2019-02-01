import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Movie from '@/components/Movie'
import Search from '@/components/Search'
import Me from '@/components/Me'
import Now from '@/components/Now'
import Coming from '@/components/Coming'
import Top from '@/components/Top'
import Love from '@/components/Love'
import Info from '@/components/Info'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie,
      children:[
         {path:'now',name:'now',component:Now},
         {path:'coming',name:'coming',component:Coming},
         {path:'top',name:'top',component:Top}
      ]
    },
    {
      path:'/info/:id',
      name:'info',
      component:Info
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path:'/love',
      name:'love',
      component:Love
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
