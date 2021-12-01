import React,{Component} from 'react';
import {Navbar, Form, FormGroup, Label, Input, Nav, NavbarToggler,Collapse,NavItem, NavbarBrand, Modal, ModalBody, ModalHeader, Button} from 'reactstrap';
import {Dropdown,DropdownItem,DropdownMenu,DropdownToggle} from 'reactstrap';
import { NavLink,Link } from 'react-router-dom';
import { Control, LocalForm, Errors  } from 'react-redux-form';
import { required, maxLength, minLength, validEmail} from "../Validator/index"
import {GoogleLogin} from 'react-google-login'
import { Icon } from '@mui/material';
import { LOGIN_SUCCESS } from '../../redux/actions/ActionTypes';
import { loginUser } from '../../redux/actions/userAction';


  function Registerer(props:any){
    if(props.isSignedIn===false)
    return (
      <React.Fragment>
          &nbsp;
      <Button color="primary" outline onClick={props.toggleRegister}>                    
     <span className="fa fa-user-plus fa-lg"></span> Register
     </Button>
      </React.Fragment>
    );
    else return(
      <React.Fragment>
      </React.Fragment>
    );
  }

interface header {
    isNavOpen: boolean,
    isModalOpen: boolean,
    isRegisterOpen: boolean,
    dropdownOpen: boolean,
    auth:any,
    registerUser: Function,
    loginUser: Function,
    logoutUser: Function,
    username:string,
    password:string,
}

interface MyComponentState { isNavOpen: boolean,
    isModalOpen: boolean,
    isRegisterOpen: boolean,
    dropdownOpen: boolean,
}

class Header extends Component<header,MyComponentState >{
    username: any;
    password: any;
    constructor(props:header){
        super(props);
        this.state ={
         isNavOpen: false,
         isModalOpen: false,
         isRegisterOpen: false,
         dropdownOpen: false
           }
        this.toggleModal=this.toggleModal.bind(this);
        this.toggleNav=this.toggleNav.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleRegister=this.toggleRegister.bind(this);
        this.toggle=this.toggle.bind(this);
    }

    toggle(){
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }

    toggleNav(){
        if(window.innerWidth<1200){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }}

    toggleRegister(event:any){
        this.setState({
        isRegisterOpen: !this.state.isRegisterOpen
      });
    }

    handleLogin(event:any) {
        this.toggleModal();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        event.preventDefault();
    }

  handleLogout() {
      this.props.logoutUser();
  }

    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }

     googleSuccess(res:any) {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
          this.props.loginUser({result,token});
    } catch (error) {
          console.log(error);
        }
    };
    
     googleError() {console.log('Google Sign In was unsuccessful. Try again later');} 


    render(){
        return (
            <React.Fragment>
                 <Navbar color="dark" dark expand="xl" fixed="top">
                    <div className="container">
                     <NavbarToggler onClick={this.toggleNav}></NavbarToggler>
                     <NavbarBrand className="mr-auto text-primary" href="/home">
                     QUANG APP
                     </NavbarBrand>
                     <Collapse isOpen={this.state.isNavOpen} navbar>
                     <Nav navbar>
                        <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link text-primary" to="/home">
                               <span className="fa fa-home fa-lg"/> Home
                           </NavLink>
                        </NavItem>
                        {this.props.auth.userinfo&&this.props.auth.userinfo.admin?(
                            <NavItem className="">
                            <Dropdown  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle color="Primary" >
                            <div className="text-primary">
                                                    <span className="fa fa-book fa-lg"/> Books
                                                   &nbsp; <i className="fa fa-caret-down fa-sm" aria-hidden="true"></i>
                                                </div>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/books">View / Modify books</DropdownItem>
                              <DropdownItem divider/>
                              <DropdownItem onClick={this.toggleNav} tag={Link} to="/add_book" >Add book</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          </NavItem>
                        ):(
                            <NavItem className="ml-2" onClick={this.toggleNav}>
                                  <NavLink className="nav-link text-primary" to="/books">
                                                    <span className="fa fa-book fa-lg"/> Books
                                                </NavLink>
                              </NavItem>
                        )}  
                        <NavItem className="ml-2" onClick={this.toggleNav}>
                            <NavLink className="nav-link text-primary" to="/search">
                                <span className="fa fa-search fa-lg"/> Search
                            </NavLink>
                        </NavItem>
                        {
                            (this.props.auth.isAuthenticated)?(
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-primary" to="/profile">
                                     <span className="fa fa-user-circle-o fa-lg"/> My Profile
                                </NavLink>
                                </NavItem>
                            ):
                            (<div/>)
                        }
                        {
                            (this.props.auth.isAuthenticated&&!this.props.auth.userinfo.admin)?(
                                <NavItem onClick={this.toggleNav} className="ml-2">
                               <NavLink className="nav-link text-primary" to="/history">
                                     <span className="fa fa-history"/> Issue history
                                </NavLink>
                                </NavItem>
                            ):
                            (<div/>)
                        }
                         {
                            (this.props.auth.isAuthenticated&&this.props.auth.userinfo.admin)?(
                              <React.Fragment>
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-primary" to="/issue">
                                     <span className="fa fa-plus-square"/> Issue Book
                                </NavLink>
                                </NavItem>
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-primary" to="/return">
                                   <span className="fa fa-list-ul"/> Return Book
                                </NavLink>
                                </NavItem>
                                <NavItem onClick={this.toggleNav} className="ml-2">
                                <NavLink className="nav-link text-primary" to="/stats">
                                   <span className="fa fa-info-circle"/> Stats
                                </NavLink>
                                </NavItem>
                              </React.Fragment>
                            ):
                            (<div/>)
                        }
                     </Nav>
                     <Nav className="ml-auto" navbar>
                     <NavItem>
                                    { !this.props.auth.isAuthenticated ?
                        <Button outline color="primary" onClick={this.toggleModal}>
                                            <span className="fa fa-sign-in fa-lg"></span> Login
                                            {this.props.auth.isLoading ?
                                                <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                : null
                                            }
                        </Button>
                                        :
                                        <div>
                                        <div className="navbar-text mr-3">{this.props.auth.user.username}</div>
                                        <Button outline color="primary" onClick={this.handleLogout}>
                                            <span className="fa fa-sign-out fa-lg"></span> Logout
                                            {this.props.auth.isLoading ?
                                                <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                : null
                                            }
                                        </Button>
                                        </div>
                                    }

            <GoogleLogin
            clientId="511106555487-m6feond50oktruagqlb0h84fi9u1uvqm.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={this.googleSuccess}
            onFailure={this.googleError}
            cookiePolicy="single_host_origin"
          />
                
                    <Registerer isSignedIn={this.props.auth.isAuthenticated} toggleRegister={()=>{this.toggleRegister(true)}}/>
                     </NavItem>
                      </Nav>
                     </Collapse>
                    </div>
                 </Navbar>
                 <Modal isOpen={!this.props.auth.isAuthenticated&&this.state.isModalOpen} toggle={this.toggleModal}>
                     <ModalHeader toggle={this.toggleModal}>
                         Sign In
                     </ModalHeader>
                     <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Login</Button>
                        </Form>
                    </ModalBody>
                     </Modal>
                 <Modal isOpen={this.state.isRegisterOpen} toggle={this.toggleRegister}>
                     <ModalHeader toggle={this.toggleRegister}>
                         Register 
                     </ModalHeader>
                     <ModalBody>
                     <LocalForm model="user" onSubmit={(values) => {
                           this.toggleRegister(true);
                            this.props.registerUser({
                              username: values.username,
                               password: values.password,
                               email: values.email,
                               roll: values.roll,
                               firstname: values.firstname,
                               lastname: values.lastname });
                              }}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Control.text model=".username" id="username" name="username" 
                            className="form-control" placeholder="Username" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".username" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Control.text model=".password" id="password" name="password" 
                            className="form-control" placeholder="Password" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".password" show="touched" messages={{required: 'Required',
                                minLength: ' Must be greater than 5 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="firstname">First Name</Label>
                                <Control.text model=".firstname" id="firstname" name="firstname" 
                            className="form-control" placeholder="firstname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".firstname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="lastname">Last Name</Label>
                                <Control.text model=".lastname" id="lastname" name="lastname" 
                            className="form-control" placeholder="lastname" validators={{required,minLength: minLength(3),maxLength:maxLength(20)}} />
                            <Errors className="text-danger" model=".lastname" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 20 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="roll">Roll No.</Label>
                                <Control.text model=".roll" id="roll" name="roll" 
                            className="form-control" placeholder="roll" validators={{required,minLength: minLength(3),maxLength:maxLength(12)}} />
                            <Errors className="text-danger" model=".roll" show="touched" messages={{required: 'Required',
                            minLength: ' Must be greater than 2 characters', maxLength:' Must be 12 characters or less'}}/>
                            </FormGroup>
                            <FormGroup>    
                                 <Label htmlFor="email">E-mail</Label>
                                <Control.text model=".email" id="email" name="email" 
                            className="form-control" placeholder="email" validators={{required,validEmail}} />
                            <Errors className="text-danger" model=".email" show="touched" messages={{required: 'Required',
                            validEmail: ' Enter a valid email'}}/>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Sign Up</Button>
                        </LocalForm>
                     </ModalBody>
                 </Modal>
                </React.Fragment>
        );
    }
}
export default Header;

function dispatch(arg0: { type: any; data: { result: any; token: any; }; }) {
    throw new Error('Function not implemented.');
}
