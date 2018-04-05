
class Cube{
    constructor(x, angle, tx, ty, tz,fudge){
        this.x = x || 0.2;
        this.angle = angle || 0;
        this.translation = [tx,ty,tz];
        this.color = [1,1,1,1];
        this.fudge =fudge;
    }

    rotate(val){
        this.angle+=val*Math.PI/180;
    }

    setColor(r, g, b, a){
        this.color = [r, g, b, a];
    }

    setTranslation(tx,ty,tz){
        this.translation = [tx,ty,tz]
    }

    collision(x){
        
        
      
 
       if(this.translation[2] <0.1 && this.translation[2] > -0.35 )
        if(x < -this.translation[0] + 0.07 && x > -this.translation[0] - 0.07)
               return false;


               return true;
        
    }


    draw(gl){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            // Front face
            -this.x, -this.x,  this.x,
             this.x, -this.x,  this.x,
             this.x,  this.x,  this.x,
            -this.x, -this.x,  this.x,
             -this.x, this.x,  -this.x,
             this.x,  this.x,  this.x,
        
        
            
            // Back face
            -this.x, -this.x, -this.x,
            -this.x,  this.x, -this.x,
             this.x,  this.x, -this.x,
            -this.x, -this.x, -this.x,
            this.x,  -this.x, this.x,
             this.x,  this.x, -this.x,
        
            
            // Top face
            -this.x,  this.x, -this.x,
            -this.x,  this.x,  this.x,
             this.x,  this.x,  this.x,
            -this.x,  this.x, -this.x,
            this.x,  -this.x,  -this.x,
             this.x,  this.x,  this.x,
        
            
            // Bottom face
            -this.x, -this.x, -this.x,
             this.x, -this.x, -this.x,
             this.x, -this.x,  this.x,
            -this.x, -this.x, -this.x,
             -this.x, this.x, this.x,
             this.x, -this.x,  this.x,
        
            
            // Right face
             this.x, -this.x, -this.x,
             this.x,  this.x, -this.x,
             this.x,  this.x,  this.x,    
             this.x, -this.x, -this.x,
             -this.x,  -this.x, this.x,
             this.x,  this.x,  this.x,    
            
            // Left face
            -this.x, -this.x, -this.x,
            -this.x, -this.x,  this.x,
            -this.x,  this.x,  this.x,
            -this.x, -this.x, -this.x,
            this.x, this.x,  -this.x,
            -this.x,  this.x,  this.x,
           
          ]), gl.STATIC_DRAW);
    }
}