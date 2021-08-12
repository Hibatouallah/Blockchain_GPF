import React, { Component } from 'react'

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
class test extends Component {
    constructor(props){
        super(props)
        this.state = { 
            buffer: null,
            imageHash : null
        };
    }
    captureFile = (event) =>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({buffer : Buffer.from(reader.result)})
        }
    }
    onSubmit = async (event) =>
    {
        event.preventDefault()
        console.log("Submitting File .....")
        if (this.state.buffer){
            const file = await ipfs.add(this.state.buffer)
            const imageHash = file[0]["hash"]
            console.log(imageHash)
          
        }
    }
  render() {
    return (
      <div style={{ margin: '0 auto', width: '100%' }}>
          <img src={'https://ipfs.infura.io/ipfs/${this.state.imageHash}'} />
      <form onSubmit={this.onSubmit}>
          <input type="file" onChange = {this.captureFile}/>
          <input type="submit" />
      </form>
      </div>
    )
  }
}
 
export default test