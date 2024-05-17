import { Button } from '@salutejs/plasma-ui'
import React from 'react'

function CustomButton(props) {
  return (
    <Button {...props} style={{
        backgroundColor: "black",
        color: "white"
    }}>
        
    </Button>
  )
}

export default CustomButton