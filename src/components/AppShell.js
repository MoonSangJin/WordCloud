import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';
import {withStyles} from '@material-ui/core/styles'; //withStyles는 material-ui 사용하면서 별도 디자인 사용하고 싶을때
import AppBar from '@material-ui/core/AppBar'; //앱바 이용위해서
import Drawer from '@material-ui/core/Drawer'; //네비게이션이 보여지게하는것
import MenuItem from '@material-ui/core/MenuItem'; //홈,게시판,qna같은 각각의 링크가 메뉴 아이템
import IconButton from '@material-ui/core/IconButton'; //앱바 왼쪽에 들어갈 아이콘
import MenuIcon from '@material-ui/icons/Menu'; //아이콘 버튼 안에 메뉴 아이콘 들어가서, 실제로 그 버튼 눌러서 Drawer가 열림

const styles = {
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: 'auto' //햄버거 버튼을 왼쪽 정렬 한 것
    }
};

class AppShell extends React.Component { //React Component 상속받아서
    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        };
    }
    handleDrawerToggle = () => this.setState({ //toggle 값 switch하는 함수
        toggle: !this.state.toggle
    })
    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <AppBar position="static">
                        <IconButton className={classes.menuButton}
                            //menuButton이라는 이름 style 적용, 햄버거 버튼 누를때 handleDrawerToggle 함수 실행
                            color="inherit"
                            //하얀색으로
                            onClick={this.handleDrawerToggle}>
                            <MenuIcon/>
                        </IconButton>
                    </AppBar>
                    <Drawer open={this.state.toggle}>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/">
                                홈 화면
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/texts">
                                텍스트 관리
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/words">
                                단어 관리
                            </Link>
                        </MenuItem>
                    </Drawer>

                </div>
                <div
                    id="content"
                    style={{
                        margin: 'auto',
                        marginTop: '20px'
                    }}>
                    {React.cloneElement(this.props.children)}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(AppShell);

// <AppShell>에서는 어떤 내용을 보여주는가 -> return하는 하나의 div 태그 React는 상태 변화를 감지하는
// 라이브러리이므로, handleDrawerToggle로 인해 값이 변화 할때 Drawer의 동작이 변화