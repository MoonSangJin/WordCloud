import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Detail extends React.Component {
  constructor(props) {
    super(props); //사용자가 접속한 텍스트의 id값을 정상적으로 받아왔는지 보여주기위해 card에서 출력해줌
  }
  render() {
    return (
      <Card>
        <CardContent>{this.props.match.params.textID}</CardContent>
      </Card>
    );
  }
}

export default Detail;
