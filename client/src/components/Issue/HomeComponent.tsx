import React,{Component} from 'react';

class Home extends Component {
    constructor(props:any){
        super(props);
        this.state={
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
      }

render(){
    return(
        <div className="container mt-5 home text-center align-self-center">
        <br/><br/><br/>
            <div className="row pt-5 darkbg text-center justify-content-center">
            <h1> Quang Home Page</h1>
            </div>
            <div className="row darkbg">

        <br/><br/><br/>
        </div>
        </div>
    )
}

}

export default Home;