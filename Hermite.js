function setUp() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var checkbox1 = document.getElementById('checkbox1');
    var showPaths = checkbox1.checked;
    var tParam = 0;

    function moveToTx(loc, Tx) { var res = vec2.create(); vec2.transformMat3(res, loc, Tx); context.moveTo(res[0], res[1]); }

    function lineToTx(loc, Tx) { var res = vec2.create(); vec2.transformMat3(res, loc, Tx); context.lineTo(res[0], res[1]); }

    function drawObject(color,Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-.05,-.05],Tx);
	    lineToTx([-.05,.05],Tx);
        lineToTx([.05,.05],Tx);
      	lineToTx([.1,0],Tx);
	    lineToTx([.05,-.05],Tx);
	    context.closePath();
	    context.fill();
	}

    function drawAxes1unit(color, Tx) {
        context.strokeStyle = color;
        context.beginPath();
        // Axes
        moveToTx([1.20, 0], Tx); lineToTx([0, 0], Tx); lineToTx([0, 1.20], Tx);
        // Arrowheads
        moveToTx([1.10, .05], Tx); lineToTx([1.20, 0], Tx); lineToTx([1.10, -.05], Tx);
        moveToTx([.05, 1.10], Tx); lineToTx([0, 1.20], Tx); lineToTx([-.05, 1.10], Tx);
        // X-label
        moveToTx([1.30, 0], Tx); lineToTx([1.40, .10], Tx);
        moveToTx([1.30, .10], Tx); lineToTx([1.40, 0], Tx);
        context.stroke();
    }

    function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {
        context.strokeStyle = color;
        context.beginPath();
        moveToTx(C(t_begin), Tx);
        for (var i = 1; i <= intervals; i++) {
            var t = ((intervals - i) / intervals) * t_begin + (i / intervals) * t_end;
            lineToTx(C(t), Tx);
        }
        context.stroke();
    }

    var Hermite = function (t) {
        return [
            2 * t * t * t - 3 * t * t + 1,
            t * t * t - 2 * t * t + t,
            -2 * t * t * t + 3 * t * t,
            t * t * t - t * t
        ];
    }

    var HermiteDerivative = function (t) {
        return [
            6 * t * t - 6 * t,
            3 * t * t - 4 * t + 1,
            -6 * t * t + 6 * t,
            3 * t * t - 2 * t
        ];
    }

    function Cubic(basis, P, t) {
        var b = basis(t);
        var result = vec2.create();
        vec2.scale(result, P[0], b[0]);
        vec2.scaleAndAdd(result, result, P[1], b[1]);
        vec2.scaleAndAdd(result, result, P[2], b[2]);
        vec2.scaleAndAdd(result, result, P[3], b[3]);
        return result;
    }

    function background() {
        // creating the sky
        context.beginPath();
        context.fillStyle = "lightblue";
        context.moveTo(0,0);
        context.lineTo(600,0);
        context.lineTo(600,600);
        context.lineTo(0,600);
        context.lineTo(0,0);
        context.fill();
        context.closePath();

        // draw the sun
        context.beginPath();
        context.lineWidth = 3;
        context.fillStyle = "yellow";
        context.arc(100, 80, 40, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();

        // draw the sun rays
        for (var theta = 0; theta <= 2 * Math.PI; theta += (Math.PI / 4)) {
            context.beginPath();
            context.save();
            context.translate(100, 80);
            context.rotate(theta);
            context.rect(60, 0, 50, 10);
            context.fill();
            context.stroke();
            context.restore();
            context.closePath();
        }

        context.lineWidth = 2;

        // creating the water
        context.beginPath();
        context.fillStyle = "darkblue";
        context.moveTo(0,300);
        context.lineTo(600,300);
        context.lineTo(600,600);
        context.lineTo(0,600);
        context.lineTo(0,300);
        context.fill();
        context.closePath();

        context.beginPath();
        // creating the waves
        for (var i = 0; i < 640; i += 30) {
            context.arc(i, 300, 20, Math.PI, 0);
        }
        context.fill();
        context.closePath();

        // creating seaweed
        context.beginPath();
        context.fillStyle = "green";
        context.moveTo(75,560);
        context.lineTo(40, 510);
        context.lineTo(60, 480);
        context.lineTo(50, 460);
        context.lineTo(75, 460);
        context.lineTo(85, 480);
        context.lineTo(65, 510);
        context.lineTo(95, 560);
        context.fill();
        context.closePath();

        context.beginPath();
        context.moveTo(85, 560);
        context.lineTo(52.5, 510);
        context.lineTo(72.5, 480);
        context.lineTo(66, 470);
        context.stroke();

        context.beginPath();
        context.fillStyle = "green";
        context.moveTo(130,560);
        context.lineTo(155, 510);
        context.lineTo(140, 460);
        context.lineTo(145, 420);
        context.lineTo(175, 420);
        context.lineTo(165, 460);
        context.lineTo(180, 510);
        context.lineTo(160, 560);
        context.fill();
        context.closePath();

        context.beginPath();
        context.moveTo(145, 560);
        context.lineTo(168, 510);
        context.lineTo(153, 460);
        context.lineTo(157, 430);
        context.stroke();

        // creating sand
        context.beginPath();
        context.fillStyle = "tan";
        context.moveTo(0,550);
        context.lineTo(600,550);
        context.lineTo(600,600);
        context.lineTo(0,600);
        context.lineTo(0,550);
        context.fill();
        context.closePath();

    }

    function shell(Tx, color) {
        context.beginPath();

        context.strokeStyle = color;

        moveToTx([0,0], Tx);
        lineToTx([10,20], Tx);
        lineToTx([20,0], Tx);
        moveToTx([0,20], Tx);
        lineToTx([20,20], Tx);
        moveToTx([10,20], Tx);
        lineToTx([5,2], Tx);
        moveToTx([10,20], Tx);
        lineToTx([10,-4], Tx);
        moveToTx([10,20], Tx);
        lineToTx([15,2], Tx);
        context.stroke();
        context.closePath();

        var halfCircle = function(t) {
            var x = 3*Math.sqrt(10)*Math.cos(t) + 10;
            var y = 3*Math.sqrt(10)*Math.sin(t);
            return [x,y];
        }

        drawTrajectory(Math.PI,2*Math.PI,100,halfCircle,Tx,color);
        context.strokeStyle = "black";
    }

    function bird(Tx, color) {
        context.beginPath();
        
        // adding detail
        context.fillStyle = "lightgrey";
        moveToTx([20,30], Tx);
        lineToTx([-5,30],Tx);
        lineToTx([-10,-10],Tx);
        lineToTx([20,30],Tx);
        context.closePath();
        context.fill();

        context.beginPath();
        context.fillStyle = color;
        // belly
        moveToTx([-10,-10], Tx);
        lineToTx([10,10], Tx);
        lineToTx([20,30], Tx);
        lineToTx([20,50], Tx);

        // beak
        lineToTx([30,40], Tx);
        lineToTx([20,40], Tx);

        // top of head
        moveToTx([20,50], Tx);
        lineToTx([0,50], Tx);
        lineToTx([-5,30], Tx);
        lineToTx([20,30], Tx);

        // wing
        moveToTx([-5,30], Tx);
        lineToTx([-5,5], Tx);
        lineToTx([-20,5], Tx);
        moveToTx([-5,30], Tx);
        lineToTx([-20,5], Tx);
        
        // tail
        moveToTx([-10,-10], Tx);
        lineToTx([-10,5], Tx);
        lineToTx([-30,-10], Tx);
        lineToTx([-20,-20], Tx);
        lineToTx([-10,-10], Tx);

        // eyes
        moveToTx([4,45], Tx);
        lineToTx([4,40], Tx);
        moveToTx([11,45], Tx);
        lineToTx([11,40], Tx);

        // feet
        moveToTx([0,0], Tx);
        lineToTx([5,-10], Tx);
        lineToTx([10,-15], Tx);
        moveToTx([5,-10], Tx);
        lineToTx([0,-15], Tx);

        moveToTx([5,5], Tx);
        lineToTx([10,-5], Tx);
        lineToTx([15,-10], Tx);
        moveToTx([10,-5], Tx);
        lineToTx([5,-10], Tx);

        context.fill();
        context.stroke();
        context.closePath();

    }

    function fish(Tx, color) {
        context.beginPath();
        context.fillStyle = color;

        // head
        moveToTx([0,0], Tx);
        lineToTx([20,0], Tx);
        lineToTx([20,-15], Tx);
        lineToTx([0,-15], Tx);
        lineToTx([0,0], Tx);

        // tail
        moveToTx([0,-7.5], Tx);
        lineToTx([-10,0], Tx);
        moveToTx([0,-7.5], Tx);
        lineToTx([-10,-15], Tx);
        lineToTx([-10,0], Tx);

        // eye
        moveToTx([15,-4], Tx);
        lineToTx([15,-9], Tx);

        context.fill();
        context.stroke();
        context.closePath();

    }

    function draw() {
        canvas.width = canvas.width;
        background();

        var TshellPos1 = mat3.create();
        mat3.fromTranslation(TshellPos1, [450,580]);
        mat3.scale(TshellPos1,TshellPos1, [1.2,1.2]);
        mat3.rotate(TshellPos1,TshellPos1,-Math.PI / 3.7);
        shell(TshellPos1,"black");

        var TshellPos2 = mat3.create();
        mat3.fromTranslation(TshellPos2, [400,565]);
        mat3.scale(TshellPos2,TshellPos2, [1.2,1.2]);
        mat3.rotate(TshellPos2,TshellPos2,Math.PI / 2.5);
        shell(TshellPos2,"white");

        var TshellPos3 = mat3.create();
        mat3.fromTranslation(TshellPos3, [100,585]);
        mat3.scale(TshellPos3,TshellPos3, [1.2,1.2]);
        mat3.rotate(TshellPos3,TshellPos3,-Math.PI / 2.5);
        shell(TshellPos3,"teal"); 

        // creating animal system
        var TanimalPaths = mat3.create();
        mat3.fromTranslation(TanimalPaths, [0, 300]);
        mat3.scale(TanimalPaths, TanimalPaths, [600, -600]);

        // bird's points
        var p0 = [0, 0.35];
        var d0 = [0.5, 0];

        var p1 = [0.3, 0.15];
        var d1 = [0.5, 0.25];

        var p2 = [0.5, 0.25];
        var d2 = [0.1, -0.05];

        var p3 = [0.65,-0.15];
        var d3 = [0.5,0];

        // fish's points
        var p4 = [1,0.4];
        var d4 = [0.5,0.25];

        var p5 = [0,-0.15];
        var d5 = [1,0];

        // other fish points
        var p6 =[0.5,-0.4];
        var d6 = [2,0];

        var p7 =[0.5,-0.3];
        var d7 = [-1.7,0];

        // bird paths
        var P0 = [p0, d0, p1, d1]; 
        var P1 = [p1, d1, p2, d2]; 
        var P2 = [p2, d2, p3, d3];
        var P3 = [p3, d3, p4, d4]; // where fish and bird travel together

        // fish path
        var P4 =[p5,d5,p3,d3];

        // other fish paths
        var P5 = [p6, d6, p7, d7];
        var P6 = [p7, d7, p6, d6];

        var C0 = function (t_) { return Cubic(Hermite, P0, t_); };
        var C1 = function (t_) { return Cubic(Hermite, P1, t_); };
        var C2 = function (t_) { return Cubic(Hermite, P2, t_); };
        var C3 = function (t_) { return Cubic(Hermite, P3, t_); };

        var G0 = function (t_) { return Cubic(Hermite, P4, t_); };

        var H0 = function (t_) { return Cubic(Hermite, P5, t_); };
        var H1 = function (t_) { return Cubic(Hermite, P6, t_); };

        var C0prime = function (t_) { return Cubic(HermiteDerivative, P0, t_); };
        var C1prime = function (t_) { return Cubic(HermiteDerivative, P1, t_); };
        var C2prime = function (t_) { return Cubic(HermiteDerivative, P2, t_); };
        var C3prime = function (t_) { return Cubic(HermiteDerivative, P3, t_); };

        var G0prime = function (t_) { return Cubic(HermiteDerivative, G0, t_); };

        var CbirdPath = function(t) {
            if(t<0.3) {
                var u = t/0.3;
                return C0(u);
            } 
            else if (t < 0.5) {
                var u = (t-0.3)/(0.2);
                return C1(u);
            }
            else if (t < 0.65) {
                var u = (t-0.5)/(0.15);
                return C2(u);
            } else {
                var u = (t-0.65)/(0.35);
                return C3(u);
            }
        }

        var CbirdVel = function(t) {
            if(t<0.3) {
                var u = t/0.3;
                return C0prime(u);
            } 
            else if (t < 0.5) {
                var u = (t-0.3)/(0.2);
                return C1prime(u);
            }
            else if (t < 0.65) {
                var u = (t-0.5)/(0.15);
                return C2prime(u);
            } else {
                var u = (t-0.65)/(0.35);
                return C3prime(u);
            }
        }

        var GfishPath = function(t) {
            if(t<0.65) {
                var u = t/0.65;
                return G0(u);
            } else {
                var u = (t-0.65)/(0.35);
                return C3(u);
            }
        }

        var HcrabPath = function(t) {
            if(t < 0.5) {
                var u = t/(0.5);
                return H0(u);
            } else {
                var u = (t-0.5)/(0.5);
                return H1(u);
            }
        }

        if(showPaths) {
            context.lineWidth = 3;
            drawTrajectory(0.0,1.0,100,C0,TanimalPaths,"green");
            drawTrajectory(0.0,1.0,100,C1,TanimalPaths,"green");
            drawTrajectory(0.0,1.0,100,C2,TanimalPaths,"green");
            drawTrajectory(0.0,1.0,100,C3,TanimalPaths,"purple");
    
            drawTrajectory(0.0,1.0,100,G0,TanimalPaths,"orange");

            drawTrajectory(0.0,1.0,100,H0,TanimalPaths,"red");
            drawTrajectory(0.0,1.0,100,H1,TanimalPaths,"red");
            context.lineWidth = 1;
            context.strokeStyle = "black";
        }

        // creating the bird
        var Tbird = mat3.create();
        mat3.fromTranslation(Tbird,CbirdPath(tParam));
        mat3.scale(Tbird, Tbird, [(1/500), (1/500)]);

        var TbirdToPath = mat3.create();
        var tangent1 = CbirdVel(tParam);
        var angle1 = Math.atan2(tangent1[1],tangent1[0]);
        mat3.rotate(Tbird,Tbird,angle1);
        mat3.multiply(TbirdToPath,TanimalPaths,Tbird);
        bird(TbirdToPath, "white");

        // creating the fish
        var Tfish = mat3.create();
        mat3.fromTranslation(Tfish, GfishPath(tParam));
        mat3.scale(Tfish,Tfish, [(1/500), (1/500)]);

        var TfishToPath = mat3.create();
        mat3.multiply(TfishToPath,TanimalPaths,Tfish);
        fish(TfishToPath, "orange");

        // creating the second fish
        var Tfish2 = mat3.create();
        mat3.fromTranslation(Tfish2, HcrabPath(tParam));
        
        // switches the direction of the second fish
        if (tParam >= 0.25 && tParam < 0.75) {
            mat3.scale(Tfish2,Tfish2, [-(1/500), (1/500)]);
        } else {
            mat3.scale(Tfish2,Tfish2, [(1/500), (1/500)]);
        }
        
        var Tfish2ToPath = mat3.create();
        mat3.multiply(Tfish2ToPath,TanimalPaths,Tfish2);
        fish(Tfish2ToPath, "red");

        if(tParam < 1) {
            tParam += 0.0035;
        } else {
            tParam = 0;
        }

        window.requestAnimationFrame(draw);
    }

    checkbox1.addEventListener("change", function () {
        if (this.checked) {
            showPaths = true;
        } else {
            showPaths = false;
        }
    });

    window.requestAnimationFrame(draw);

}

window.onload = setUp;