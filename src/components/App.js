import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import AppShell from './AppShell';
import Home from './Home';
import Texts from './Texts';
import Words from './Words';

class App extends React.Component { //React.Component를 상속받아서 화면에 출력 될 내용 명시
    render() {
        return (
            <Router>
                <AppShell>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/texts" component={Texts}/>
                        <Route exact path="/words" component={Words}/>
                    </div>
                </AppShell>
            </Router> //경로에 따라 다른 component를 보여준다.

        );
    }
}

export default App; //App이라는 컴포넌트를 main.js에서 사용할 수 있도록 export 해준다.

//사용자가 메인페이지 App.js에 접속하면 <AppShell>을 보여준다.