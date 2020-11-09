import React, { useRef, useEffect } from 'react'

const Canvas = props => {


    const { draw, ...rest} = props
    const canvasRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.clearRect(0, 0, canvas.width, canvas.height);
        draw(context, props.width, props.height, props.offset, props.room);
        }, [draw, props])
    
  
  return <canvas ref={canvasRef} {...props}/>   
}

export default Canvas