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
        <div className="container mt-4 home text-center align-self-center">
            <h1>Welcome</h1>
        </div>
        );
}

}

export default Home;