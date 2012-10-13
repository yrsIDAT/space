var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
document.onkeydown = keypress
var md = false
var lastX
var lastY
var cx
var cy
var mx = [288, 396, 372, 263, 338, 339, 335, 915, 906, 910, 1010, 846, 844, 982, 985, 853, 976, 518, 650, 660, 526, 528, 667, 709, 512, 521, 580, 683, 636, 585]
var my = [324, 246, 307, 251, 365, 442, 521, 557, 380, 257, 465 , 286, 354, 404, 538, 523, 288, 387, 369, 250, 458, 535, 493, 543, 315, 251, 236, 311, 436, 400]
var mxv = [0, 0, 0, 0, 0, 3, 0, 3.14, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var myv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.14, 3.14, 3.14, 3.14, 3.14, 3.14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var mp = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
var mo = [0, 0, 0, 0, 0, 3.14159 / 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var mov = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var mf = []
var mc = 30
var width = 16
var selected = -1
var asel  = -1
var dsel = -1
var pole = 1
var paused = false
var alerts = false
var fview = false

ctx.fillStyle = "#ffffff"
ctx.fillRect(0, 0, canvas.width, canvas.height)

for (i = 0; i < mc; i++)
{
    mx[i] += canvas.width / 2 - 600
    my[i] += canvas.height / 2 - 400
    mf[i] = false
}

canvas.addEventListener("mousemove", mousemove)

function fieldview()
{
    if (fview == false )
    {
        fview = true
        
        for (var x = 0; x <= canvas.width; x++)
        {
            for (var y = 0; y < canvas.height; y++)
            {
                var xv = 0
                var yv = 0
                
                for (var j = 0; j < mc; j++)
                {
                    var dx = x - mx[j] + 0.75*mp[j] * Math.cos(mo[j])
                    var dy = y - my[j] + 0.75*mp[j] * Math.sin(mo[j])
                    var dist = Math.sqrt(dx * dx + dy * dy)
                    var force = mp[j]*mp[j]/(dist*dist)
                    xv += dx * force / dist
                    yv += dy * force / dist
                    dx = x - mx[j] - 0.75*mp[j] * Math.cos(mo[j])
                    dy = y - my[j] - 0.75*mp[j] * Math.sin(mo[j])
                    dist = Math.sqrt(dx * dx + dy * dy)
                    force = mp[j]*mp[j]/(dist*dist)
                    xv -= dx * force / dist
                    yv -= dy * force / dist
                }
                var angle = Math.atan((yv)/(xv))
                
                power = Math.sqrt(xv * xv + yv * yv)
                
                alpha = Math.sqrt(Math.sqrt(power)) * 300
                
                if (alpha > 255)
                {
                    alpha = parseInt(alpha)
                    if (alpha > 405) alpha = 405
                    ctx.fillStyle = "rgb(" + (alpha - 255) + ",0," + (255) + ")"
                }
                else if (alpha > 100)
                {
                    alpha = parseInt(alpha)
                    ctx.fillStyle = "rgb(0," + (255 - alpha) + "," + (alpha) + ")"
                }
                else if (alpha > 50)
                {
                    alpha = parseInt(alpha)
                    ctx.fillStyle = "rgb(" + (500 - alpha * 5) + "," + (355 - alpha * 2) + "," + (alpha * 2 - 100) + ")"
                }
                else
                {
                    ctx.fillStyle = "rgb(" + (255 - parseInt(alpha / 10)) + "," + (parseInt(alpha) * 5 + 5) + ",0)"
                }
                
                ctx.fillRect(x, y, 1, 1)
            }
        }
    }
}

function exitfview()
{
    fview = false
}

function pause()
{
    if (paused)
    {
        paused = false
    }
    else
    {
        paused = true
    }
}

function enalerts()
{
    if (alerts)
    {
        alerts = false
    }
    else
    {
        alerts = true
    }
}

function delmag()
{
    if (dsel != -1 && mc > 0)
    {
        for (i = dsel + 1; i < mc; i++)
        {
            mx[i - 1] = mx[i]
            my[i - 1] = my[i]
            mxv[i - 1] = mxv[i]
            myv[i - 1] = myv[i]
            mp[i - 1] = mp[i]
            mo[i - 1] = mo[i]
            mov[i - 1] = mov[i]
        }
        mc -= 1
        dsel = -1
    }
}

function newmag()
{
    mx[mc] = canvas.width / 2
    my[mc] = canvas.height / 2
    mxv[mc] = 0
    myv[mc] = 0
    mp[mc] = 16
    mo[mc] = 0
    mov[mc] = 0
    mf[mc] = false
    dsel = mc
    mc++
}

function random()
{
    mx[mc] = canvas.width * Math.random()
    my[mc] = canvas.height * Math.random()
    mxv[mc] = 0
    myv[mc] = 0
    mp[mc] = 16
    mo[mc] = 3.14159 * 2 * Math.random()
    mov[mc] = 0
    mf[mc] = false
    dsel = mc
    mc++
}

function wipe()
{
    mc = 0
}

function enlarge()
{
    mp[dsel] += 2
}

function shrink()
{
    if (mp[dsel] > 8)
    {
        mp[dsel] -= 2
    }
}

function freeze()
{
    if (mf[dsel])
    {
        mf[dsel] = false
    }
    else
    {
        mf[dsel] = true
    }
}

function unfreeze()
{
    for (i = 0; i < mc; i++)
    {
        mf[i] = false
    }
}

function keypress(key)
{
    if (key.keyCode == "E".charCodeAt(0))
    {
        exitfview()
    }
    
    if (fview == false)
    {
        if (key.keyCode == "U".charCodeAt(0))
        {
            unfreeze()
        }
        
        if (key.keyCode == "F".charCodeAt(0))
        {
            freeze()
        }
        
        if (key.keyCode == "P".charCodeAt(0))
        {
            pause()
        }
        
        if (key.keyCode == "C".charCodeAt(0))
        {
            wipe()
        }
        
        if (key.keyCode == "A".charCodeAt(0))
        {
            enalerts()
        }
        
        if (key.keyCode == 46)
        {
            delmag()
        }
        
        if (key.keyCode == "N".charCodeAt(0))
        {
            newmag()
        }
        
        if (key.keyCode == "V".charCodeAt(0))
        {
            fieldview()
        }
        
        if (key.keyCode == "R".charCodeAt(0))
        {
            random()
        }
        
        if (key.keyCode == 107)
        {
            enlarge()
        }
        
        if (key.keyCode == 109)
        {
            shrink()
        }
    }
}

function MD()
{
    if (fview == false)
    {
        md = true
        selected = -1
        for (i = 0; i < mc; i++)
        {
            var dist = Math.sqrt((mx[i] - cx) * (mx[i] - cx) + (my[i] - cy) * (my[i] - cy))
            angle = Math.atan((my[i] - cy) / (mx[i] - cx))
            if ((mx[i] - cx) > 0)
            {
                angle += 3.1415926535897932384626433
            }
            var rx = mx[i] - dist * Math.cos(angle - mo[i])
            var ry = my[i] - dist * Math.sin(angle - mo[i])
            if (rx >= mx[i] -  1.5*mp[i] && rx <= mx[i] +  1.5*mp[i] && ry >= my[i] - mp[i] / 2 && ry <= my[i] + mp[i] / 2)
            {
                if (msel == i)
                {
                    msel = -1
                }
                else
                {
                    msel = i
                    dsel = i
                }
            }
            else
            {
                if (rx >= mx[i] - mp[i] * 3 && rx <= mx[i] + mp[i] * 3 && ry >= my[i] - mp[i] / 2 && ry <= my[i] + mp[i] / 2)
                {
                    if (asel == i)
                    {
                        asel = -1
                    }
                    else
                    {
                        asel = i
                    }
                    if (rx < mx[i])
                    {
                        pole = 1
                    }
                    else
                    {
                        pole = -1
                    }
                }
            }
        }
    }
}

function MU()
{
    md = false
    msel = -1
    asel = -1
}

function physics()
{
    for (var i = 0; i < mc; i++)
    {
        /*if (i != msel)
        {
            mx[i] += mxv[i]
            my[i] += myv[i]
        }*/
        if (i != asel && mf[i] == false) mo[i] += mov[i]
        mxv[i] *= 0.9
        myv[i] *= 0.9
        mov[i] *= 0.9
    }
    
    for (var i = 0; i < mc; i++)
    {
        for (var j= 0; j < mc; j++)
        {
            if (i != j && mf[i] == false)
            {
                var xv1 = 0
                var yv1 = 0
                var xv2 = 0
                var yv2 = 0
                var dx = (mx[i] + 0.75*mp[i] * Math.cos(mo[i]) - (mx[j] + 0.75*mp[j] * Math.cos(mo[j])))
                var dy = (my[i] + 0.75*mp[i] * Math.sin(mo[i]) - (my[j] + 0.75*mp[j] * Math.sin(mo[j])))
                var dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    var force = mp[j] * mp[j]/(dist*dist)
                    
                    if (dx == 0)
                    {
                        o2 = 0
                    }
                    else
                    {
                        o2 = Math.atan(dy / dx)
                    }
                    if (dx < 0)
                    {
                        o2 += 3.141592653489793
                    }
                    
                    o3 = 3.141592653489793 / 2 + o2 - mo[i]
                    pd = force * Math.cos(o3)
                    mov[i] -= pd * 10
                    
                    if (alerts) alert(force)
                    
                    xv1 += dx * force / dist
                    yv1 += dy * force / dist
                }
                dx = (mx[i] + 0.75*mp[i] * Math.cos(mo[i]) - (mx[j] - 0.75*mp[j] * Math.cos(mo[j])))
                dy = (my[i] + 0.75*mp[i] * Math.sin(mo[i]) - (my[j] - 0.75*mp[j] * Math.sin(mo[j])))
                dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    force = mp[j] * mp[j]/(dist*dist)
                    
                    if (dx == 0)
                    {
                        o2 = 0
                    }
                    else
                    {
                        o2 = Math.atan(dy / dx)
                    }
                    if (dx < 0)
                    {
                        o2 += 3.141592653489793
                    }
                    
                    o3 = 3.141592653489793 / 2 + o2 - mo[i]
                    pd = force * Math.cos(o3)
                    mov[i] += pd * 10
                    
                    if (alerts) alert(force)
                    
                    xv1 += -dx * force / dist
                    yv1 += -dy * pd / dist
                }
                mxv[i] += xv1 * 10000
                myv[i] += yv1 * 10000
                
                dx = (mx[i] - 0.75*mp[i] * Math.cos(mo[i]) - (mx[j] + 0.75*mp[j] * Math.cos(mo[j])))
                dy = (my[i] - 0.75*mp[i] * Math.sin(mo[i]) - (my[j] + 0.75*mp[j] * Math.sin(mo[j])))
                dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    force = mp[j] * mp[j]/(dist*dist)
                    
                    if (dx == 0)
                    {
                        o2 = 0
                    }
                    else
                    {
                        o2 = Math.atan(dy / dx)
                    }
                    if (dx < 0)
                    {
                        o2 += 3.141592653489793
                    }
                    
                    o3 = 3.141592653489793 / 2 + o2 - mo[i]
                    pd = force * Math.cos(o3)
                    mov[i] -= pd * 10
                    
                    if (alerts) alert(force)
                    
                    xv2 += -dx * force / dist
                    yv2 += -dy * force / dist
                }
                dx = (mx[i] - 0.75*mp[i] * Math.cos(mo[i]) - (mx[j] - 0.75*mp[j] * Math.cos(mo[j])))
                dy = (my[i] - 0.75*mp[i] * Math.sin(mo[i]) - (my[j] - 0.75*mp[j] * Math.sin(mo[j])))
                dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    force = mp[j] * mp[j]/(dist*dist)
                    
                    if (dx == 0)
                    {
                        o2 = 0
                    }
                    else
                    {
                        o2 = Math.atan(dy / dx)
                    }
                    if (dx < 0)
                    {
                        o2 += 3.141592653489793
                    }
                    
                    o3 = 3.141592653489793 / 2 + o2 - mo[i]
                    pd = force * Math.cos(o3)
                    mov[i] += pd * 10
                    
                    if (alerts)
                    {
                        alert(force)
                        //alert(pd / mp[i])
                        alerts = false
                    }
                    
                    xv2 += dx * force / dist
                    yv2 += dy * force / dist
                }
                mxv[i] += xv2 * 10000
                myv[i] += yv2 * 10000
                
                //alert(mov[i])
                
                
                
                
            }
        }
    }
}

function clock()
{
    if (fview == false)
    {
        if (paused == false)
        {
            physics()
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, 1200, 800)
        
        ctx.strokeStyle = "#000000"
        
        for (i = 1; i <= canvas.width * canvas.height / (width * width); i++)
        {
            var y = parseInt((i - 1) / (canvas.width / width)) * width + width / 2
            var x = (i - 1) % (canvas.width / width) * width + width / 2
            var xv = 0
            var yv = 0
            
            for (var j = 0; j < mc; j++)
            {
                var dx = x - mx[j] + 0.75*mp[j] * Math.cos(mo[j])
                var dy = y - my[j] + 0.75*mp[j] * Math.sin(mo[j])
                var dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    var force = mp[j]*mp[j]/(dist*dist)
                    xv += dx * force / dist
                    yv += dy * force / dist
                }
                dx = x - mx[j] - 0.75*mp[j] * Math.cos(mo[j])
                dy = y - my[j] - 0.75*mp[j] * Math.sin(mo[j])
                dist = Math.sqrt(dx * dx + dy * dy)
                if (dist != 0)
                {
                    force = mp[j]*mp[j]/(dist*dist)
                    xv -= dx * force / dist
                    yv -= dy * force / dist
                }
            }
            var angle = Math.atan((yv)/(xv))
            
            power = Math.sqrt(xv * xv + yv * yv)
            
            alpha = power * 1000
            
            if (alpha > 1)
            {
                alpha = parseInt((alpha) * 10)
                if (alpha > 255) alpha = 255
                ctx.strokeStyle = "rgb(0,0," + alpha + ")"
                //ctx.fillRect(x - width / 2, y - width / 2, width, width)
                alpha = 1
            }
            
            if (alpha < 0) alert(power * 1000 + ", " + alpha)
            
            ctx.globalAlpha = alpha
            
            ctx.beginPath()
            ctx.moveTo(x - Math.cos(angle) * width / 2, y - Math.sin(angle) * width / 2)
            ctx.lineTo(x + Math.cos(angle) * width / 2, y + Math.sin(angle) * width / 2)
            ctx.closePath()
            ctx.stroke()
            
            ctx.globalAlpha = 1
            ctx.strokeStyle = "#000000"
        }
        
        for (i = 0; i < mc; i++)
        {
            ctx.setTransform(Math.cos(-mo[i]), -Math.sin(-mo[i]), Math.sin(-mo[i]), Math.cos(-mo[i]), mx[i], my[i])
            ctx.fillStyle = "#ff0000"
            ctx.fillRect(-1.5*mp[i], -mp[i] / 2,  1.5*mp[i], mp[i])
            ctx.setTransform(Math.cos(-mo[i]), -Math.sin(-mo[i]), Math.sin(-mo[i]), Math.cos(-mo[i]), mx[i], my[i])
            ctx.fillStyle = "#0000ff"
            ctx.fillRect(0, -mp[i] / 2,  1.5*mp[i], mp[i])
        }
        
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        
        /*for (i = 0; i < mc; i++)
        {
            ctx.fillStyle = "#ff0000"
            ctx.fillRect(-20, -mp[i] / 2, 20, mp[i])
            ctx.fillStyle = "#0000ff"
            ctx.fillRect(0, -mp[i] / 2, 20, mp[i])
        }*/
    }
}

setInterval(clock, 20)

function mousemove(mouseEvent)
{
    if (fview == false)
    {
        lastX = cx
        lastY = cy
        
        cx = mouseEvent.offsetX
        cy = mouseEvent.offsetY
        
        /*for (i = 0; i < mc; i++)
        {
            ctx.fillStyle = "#ff0000"
            ctx.fillRect
        }*/
        
        if (md && (msel != -1))
        {
            mx[msel] += cx - lastX
            my[msel] += cy - lastY
        }
        
        if (md && (asel != -1))
        {
            if (cx - mx[asel] == 0)
            {
                mo[asel] = 3.1415926535897932384626433 / 2
                if (cy - my[asel] < 0)
                {
                    mo[asel] += 3.1415926535897932384626433
                }
            }
            else
            {
                mo[asel] = Math.atan((cy - my[asel]) / (cx - mx[asel]))
            }
            if (cx - mx[asel] < 0)
            {
                mo[asel] += 3.1415926535897932384626433
            }
            if (pole == -1)
            {
                mo[asel] += 3.1415926535897932384626433
            }
        }
    }
}