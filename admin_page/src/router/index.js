import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    children:[
      {
        path:"menuadminoption",
        name:"MenuAdmin",
        component:()=>import("../views/MenuAdminOpt.vue")
      },
      {
        path:"menutypeoption",
        name:"Menutype",
        component:()=>import("../views/MenuTypeOpt.vue")
      },
      {
        path:"orderadmin",
        name:"OrderAdmin",
        component:()=>import("../views/OrderAdmin.vue")
      },
      {
        path:"dataanalysis",
        name:"Dataanalysis",
        component:()=>import("../views/DataAnalysis.vue")
      },
      {
        path:"tableadmin",
        name:"TableAdmin",
        component:()=>import("../views/TableAdmin.vue")
      },
      {
        path:"pageinfo",
        name:"PageInfo",
        component:()=>import("../views/PageInfo.vue")
      }
    ],
    redirect: "/home/menuadminoption"
  },
  {
    path: "/",
    name: "Login",
    component: () =>
      import("../views/Login.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
