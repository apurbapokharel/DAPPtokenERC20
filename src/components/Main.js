import React, { Component } from 'react';

class Main extends Component {

    componentWillUpdate(){
        var progressPercent = (Math.ceil(this.props.tokensSold) / 750000) * 100
        var fillBar = document.getElementById('progress')
        fillBar.style.width = progressPercent + '%'
    }

  render() {
    return (
      <div className="container ">
          <div className="row ">
                <div className="col-lg-12">
                    <h1 className="">EXCHANGE</h1>
                    <hr/>
                    <br/>
                </div>

                <div id="content" className="">
                    {/* <div className="text-center"> */}
                        <p >
                            Introducing "DApp Token" (DAPP)!
                            Token price is {this.props.tokenPriceEther} Ether. You currently have {this.props.tokenHeld}&nbsp;DAPP.
                        </p>
                        <br/>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            const value = this.numberOfTokens.value
                            console.log(value)
                            this.props.buyTokens(value)
                        }} role="form">
                            <div className="form-group">
                            <div className="input-group">
                                <input 
                                id="numberOfTokens" 
                                className="form-control input-lg" 
                                type="number" 
                                name="number" 
                                placeholder="1 or more"
                                pattern="[0-9]"
                                ref = {(input) => {this.numberOfTokens = input}}
                                required
                                />
                                
                                <span className="input-group-btn">
                                <button type="submit" className="btn btn-primary btn-lg">Buy Tokens</button>
                                </span>
                            </div>
                            </div>
                        </form>
                        <br/>
                        <div className="progress">
                            <div id="progress" className="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <p>{this.props.tokensSold} / 750000 tokens sold</p>
                        <hr />
                        <p id="accountAddress"></p>
                    {/* </div>  */}
                </div>

                <div className="col-lg-12">
                    <h1 className="">TRANSFER</h1>
                    <hr/>
                    <br/>
                </div>

                <div id="content" className="">
                    {/* <div className="text-center"> */}
                        <p >
                           Transfer tokens from {this.props.account} . You currently have {this.props.tokenHeld}&nbsp;DAPP.
                        </p>
                        <br/>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            const address = this.transferAddress.value
                            const value = this.transferValue.value
                            console.log(address)
                            this.props.transferTokens(address, value)
                        }} role="form">
                            <div className="form-group">
                                <div className="input-group">
                                    <input 
                                    id="transferAddress" 
                                    className="form-control input-lg"  
                                    name="number" 
                                    placeholder="address"
                                    ref = {(input) => {this.transferAddress = input}}
                                    required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <input 
                                    id="transferValue" 
                                    className="form-control input-lg" 
                                    type="number" 
                                    name="number" 
                                    placeholder="1 or more"
                                    pattern="[0-9]"
                                    ref = {(input) => {this.transferValue = input}}
                                    required
                                    />
                                    <span className="input-group-btn">
                                    <button type="submit" className="btn btn-primary btn-lg">Transfer Tokens</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                        <br/>
                        <hr />
                        
                    {/* </div>  */}
                </div>



                
          </div>
      </div>
    );
  }
}

export default Main;
