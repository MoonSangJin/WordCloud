import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  },
});

const databaseURL = 'https://word-cloud-db494.firebaseio.com/';

class Words extends React.Component {
  constructor() {
    super();
    this.state = {
      words: {},
      dialog: false,
      word: '',
      weight: '',
    };
  }

  _get() {
    //데이터 베이스 url의 words.json에 접속해서 데이터 가져오는 함수
    fetch(`${databaseURL}/words.json`)
      .then((res) => {
        if (res.status != 200) {
          //상태코드 200번이 아니라면 => 파이어베이스 서버의 오류 발생
          console.log('firebase error');
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((words) => this.setState({ words: words })); //결과 데이터를 words 변수에 담아서, words state 값에 단어정보를 넣어라
  }

  // post는 데이터를 보내고 get은 데이터를 받아오는 방식 <REST API 서버 개발할 때 쓰는 API>
  _post(word) {
    //firebase는 rest api 형식 지원 따라서 database url에 post 방식으로 접근하여 기입하면 데이터 자체가 json 형태로 기입됨
    return fetch(`${databaseURL}/words.json`, {
      method: 'POST',
      body: JSON.stringify(word), //stringify는 js 값이나 객체를 json 문자열로 변환하는 메소드
    })
      .then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        //새로 추가된 정보를 화면에 보여주기 위한 부분
        let nextState = this.state.words;
        nextState[data.name] = word;
        this.setState({ words: nextState });
      });
  }

  _delete(id) {
    return fetch(`${databaseURL}/words/${id}.json`, { method: 'DELETE' }) //특정 id값 접근해서 지우는 함수
      .then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(() => {
        //삭제된 정보를 화면에 보여주기 위한 부분
        let nextState = this.state.words;
        delete nextState[id];
        this.setState({ words: nextState });
      });
  }

  // shouldComponentUpdate(nextProps, nextState) {     return nextState.words !=
  // this.state.words 변경 되었을때만 component 업데이트 }

  componentDidMount() {
    this._get(); //component 구성된 다음 자동으로 수행되는 react가 제공하는 함수 즉 페이지 구성되자마자 단어 정보 불러와서 state에 담는다.
  }

  handleDialogToggle = () =>
    this.setState({
      dialog: !this.state.dialog,
    });

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  handleSubmit = () => {
    const word = {
      word: this.state.word,
      weight: this.state.weight,
    };
    this.handleDialogToggle();
    if (!word.word && !word.weight) {
      return; //이름이나 가중치 입력안하면 등록 X
    }
    this._post(word); //이름이나 가중치 제대로 입력했으면 해당 단어를 post함수로 firebase database에 등록
  };

  handleDelete = (id) => {
    this._delete(id);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {Object.keys(this.state.words).map((id) => {
          const word = this.state.words[id]; //word는 json에서 가져온 세개가 들어있는 한 묶음
          return (
            <div key={id}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom="gutterBottom">
                    가중치: {word.weight}
                  </Typography>
                  <Grid container="container">
                    <Grid item="item" xs={6}>
                      <Typography variant="h5" component="h2">
                        {word.word}
                      </Typography>
                    </Grid>
                    <Grid item="item" xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleDelete(id)}
                      >
                        삭제
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <br />
            </div>
          );
        })}

        <Fab
          color="primary"
          className={classes.fab}
          onClick={this.handleDialogToggle}
        >
          <AddIcon />
        </Fab>
        <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
          <DialogTitle>단어 추가</DialogTitle>
          <DialogContent>
            <TextField
              label="단어"
              type="text"
              name="word"
              value={this.state.word}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="가중치"
              type="number"
              name="weight"
              value={this.state.weight}
              onChange={this.handleValueChange}
            />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              추가
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleDialogToggle}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Words);

/*dialog 변수가 true값일 때 열리고 닫히는 이벤트 onClose발생시 toggle */
// 사용자가 입력하는 내용은 word라는 state값 되고 사용자가 입력해서 event 발생시 handleValueChange 함수가
// word라는 state 변수값 수정해서 화면에 사용자가 입력한 데이터 나옴
