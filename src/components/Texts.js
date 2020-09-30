import TextTruncate from 'react-text-truncate';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Link as RouterLink } from 'react-router-dom'; //특정 다른 경로로 이동시키기 위한 Link 라이브러리(react-router-dom) 근데 material이랑 이름겹치니까 RouterLink란 이름으로 대신사용하겠다.
import Link from '@material-ui/core/Link';

const styles = (theme) => ({
  hidden: {
    display: 'none',
  },
  fab: {
    //우측 하단 고정
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  },
});

const databaseURL = 'https://word-cloud-db494.firebaseio.com/';

class Texts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      fileContent: null,
      texts: '',
      textName: '',
      dialog: false,
    };
  }

  _get() {
    fetch(`${databaseURL}/texts.json`)
      .then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((texts) =>
        this.setState({
          texts: texts == null ? {} : texts, //texts가 null 즉 아무것도 없으면 text변수 비워두고, 하나라도 있으면 texts라는 변수 안에 데이터 담는다
        })
      );
  }

  _post(text) {
    return fetch(`${databaseURL}/texts.json`, {
      method: 'POST',
      body: JSON.stringify(text),
    })
      .then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        let nextState = this.state.texts;
        nextState[data.name] = text;
        this.setState({ texts: nextState }); //texts를 갱신해야함
      });
  }

  _delete(id) {
    return fetch(`${databaseURL}/texts/${id}.json`, { method: 'DELETE' })
      .then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(() => {
        let nextState = this.state.texts;
        delete nextState[id];
        this.setState({ texts: nextState }); //삭제될 texts 반영되게
      });
  }

  componentDidMount() {
    this._get();
  }

  handleDialogToggle = () =>
    this.setState({
      dialog: !this.state.dialog,
      fileName: '',
      fileContent: '',
      textName: '',
    }); /*
    텍스트창 등록하는 dialog창이 켜졌다 꺼졌다하는 부분 담당, 
    파일이 추가되었거나 dialog 창이 닫아진 경우에 호출되므로 파일 내용 제거되게 해야함
    */

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  handleSubmit = () => {
    const text = {
      /*우리가 보낼 내용은 textName과 textContent로 구성 */
      textName: this.state.textName,
      textContent: this.state.fileContent,
    };
    this.handleDialogToggle();
    if (!text.textName || !text.textContent) {
      return;
    }
    this._post(text); //post 방식으로 파이어베이스 서버에 등록
  };

  handleDelete = (id) => {
    this._delete(id);
  };

  handleFileChange = (e) => {
    /*사용자가 파일 업로드시 나오는 함수 */
    let reader = new FileReader();
    reader.onload = () => {
      let text = reader.result; //읽어들인 내용은 text에 담아서
      this.setState({ fileContent: text }); //filecontent라는 state에 담아줌
    };
    reader.readAsText(e.target.files[0], 'EUC-KR'); //하나의 파일만 읽는다고 가정 윈도우경우 EUC-KR로 인코딩해야 정상적으로 읽혀짐
    this.setState({ fileName: e.target.value }); //target의 value값이 fileName이 된다.
  };

  render() {
    //위에서 만든 함수를 사용해서 텍스트파일 등록,삭제하는 디자인을 만들어보자
    const { classes } = this.props;
    return (
      <div>
        {' '}
        {/* jsx의 기본: 여러개가 들어가면 div하나로 감싸야됨 */}
        {Object.keys(this.state.texts).map((id) => {
          const text = this.state.texts[id]; //text state에 포함되어있는 모든 원소를 map함수로 id 기준으로 방문하면서 카드 형태로 출력
          return (
            <Card key={id}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom="gutterBottom">
                  내용:{' '}
                  {
                    text.textContent.substring(0, 24) + '...' //js에서 파일내용자르는 함수 => substring 24자까지 보여줌
                  }
                </Typography>
                <Grid container="container">
                  {' '}
                  {/* grid에 container 속성 넣어주어야 보기,삭제 속성이 한줄로 출력됨 */}
                  <Grid item="item" xs={6}>
                    {' '}
                    {/* 6 3 3 즉 2대1대1로 나눠서 보여줄 것 */}
                    <Typography variant="h5" component="h2">
                      {text.textName.substring(0, 14) + '...'}
                    </Typography>
                  </Grid>
                  <Grid item="item" xs={3}>
                    <Typography variant="h5" component="h2">
                      <Link component={RouterLink} to={'detail/' + id}>
                        {' '}
                        {/* 버튼 눌렀을때 detail경로 즉 id 값으로 이동할수있게 */}
                        <Button variant="contained" color="primary">
                          보기
                        </Button>
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item="item" xs={3}>
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
          {/* dialog 변수가 true값일 때 Dialog창이 열림 handlDialogToggle함수에 따라 닫힘*/}

          <DialogTitle>텍스트 추가</DialogTitle>
          <DialogContent>
            <TextField
              label="텍스트 이름"
              type="text"
              name="textName"
              value={this.state.textName}
              onChange={this.handleValueChange}
            />
            <br />
            <br />
            <input //파일 업로드 하는 부분
              className={classes.hidden}
              accept="text/plain"
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                name="file"
              >
                {this.state.fileName === ''
                  ? '.txt 파일 선택'
                  : this.state.fileName}
              </Button>
            </label>

            {/*  TextTruncate는 파일 내용 조금 보여주는 것*/}
            <TextTruncate
              line={1}
              truncateText="..."
              text={this.state.fileContent}
            />
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

export default withStyles(styles)(Texts);
