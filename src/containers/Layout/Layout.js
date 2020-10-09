import React,{ Suspense } from 'react'
import { Redirect, Route, Switch} from 'react-router-dom'
import * as router from 'react-router-dom'
import { Container } from 'reactstrap'
import Spinner from 'react-spinkit'
import {
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav2 as AppSidebarNav,
     AppBreadcrumb2 as AppBreadcrumb
  } from '@coreui/react';


  // sidebar nav config
  import navigation from '../../_nav'
  // routes config
  import routes from '../../routes'
  import Header from './Header'
  import Footer from './Footer'

  class Layout extends React.Component {

    loading = () => <div className="animated fadeIn pt-1 text-center"><Spinner name="three-bounce" /></div>

      render() {

          return (
              <div className="app">
                <AppHeader fixed >
                    <Suspense fallback={this.loading()}>
                        <Header onLogout={e=>this.signOut(e)} />
                    </Suspense>
                </AppHeader>

                <div className="app-body">
                    <AppSidebar fixed display="lg" minimized={false}>
                        <AppSidebarHeader/>
                        <AppSidebarForm/>
                        <Suspense>
                            <AppSidebarNav navConfig={navigation} {...this.props} router={router}/> 
                        </Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer  />
                    </AppSidebar>
                    <main className="main">
                        <AppBreadcrumb appRoutes={routes} router={router}/>
                        <Container fluid  >
                            <Suspense fallback={this.loading()}>
                                <Switch>
                                 {routes.map((route, idx) => {
                                        return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                            <route.component {...props} />
                                            )} />
                                        ) : (null);
                                    })}  

                                    {/* <Redirect from="/" to="/" /> */}
                                </Switch>
                            </Suspense>
                        </Container>
                    </main>

                </div>
                <AppFooter>
                    <Suspense fallback={this.loading()}>
                        <Footer/>
                    </Suspense>
                </AppFooter>

              </div>
          )
      }
  }

  export default Layout