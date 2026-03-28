+++
title = 'SDF Renderer'
summary  = "Diablo clone"
projectLength = '2026 | 8 Weeks | 1 Person'
badges = ["C++", "HLSL", "3D", "Graphics"]

image = "/projects/Specialization/Specialization-thumb.jpg"
showFeaturedImage = false
weight = 1
toc = false
+++
# Introduction
For my specialization project at the game assembly i decided i wanted to explore something that had recently caught my interest. A [friend](https://www.codrea.nu) of mine had shown me a video of someone making an entire game engine using only signed distance functions (SDF), a form of rendering not very used in games in general. My main goal was mostly to try it out and try to make an SDF renderer as optimized as possible in the time allocated for the project.

# What is SDF?
Signed distance functions are formulas that take a point as input and return its distance to the shapes surface with a negative value if the point is inside the shape. Below is an example of what a spheres SDF would look like in HLSL:
```HLSL
float SphereSDF(float3 aPoint, float aRadius)
{
  return length(aPoint) - aRadius;
}
```
These distances are then used for rendering by using raymarching. Raymarching works by finding the distance of the closest surface and then marching along the ray that distance to then sample the scene again. This is done iteratively until the distance falls within a threshold to be counted as a hit. Below is an interactive demo showing this process in action:
{{< sdf-demo >}}

# Project Setup
As engine i decided to use my project from our old graphics course. I decided to do this mostly to minimize bloat as i knew most logic would happen in a shader and i would still need to make my own rendering pipeline. The first few days of the project was mostly spent ripping out old mesh based code and replacing the pipeline with just a fullscreen quad output from a vertex shader going into a pixel shader doing all the raymarching.

# Performance
I knew before even starting that performance would be a big issue since for every rays scene sample loads of complex math functions would be calculated each frame. One major optimization i implemented was to use a 3D texture as a brickmap to cache previously calculated values to be able to sample the brickmap instead of recalculating all SDFs. To be able to increase the render distance without consuming too much memory i used multiple brickmaps stacked on top of eachother with increasing size but decreasing resolution acting as LOD for objects farther away.

![brickmap.gif](/images/brickmap.gif)

###### (Brickmap cells colored and size exaggerated for demonstation)

# SDF operations
One of the things that really interested me with SDF is the flexibility you can do with SDF operations due SDF being only mathematical functions. SDF operations work as sort of filters to the calculations and can be used to create unique effects that wouldnt really be viable when using traditional rendering methods due to the performance cost of rebuilding meshes. The three operations i decided to implement were unions, subtractions and intersections.

```HLSL
float Union( float aShapeA, float aShapeB )
{
    return min(aShapeA,aShapeB);
}
float Subtraction( float aShape, float aShapeB )
{
    return max(-aShapeA,aShapeB);
}
float Intersection( float aShape, float aShapeB )
{
    return max(aShapeA,aShapeB);
}
```

#### Union
A union is defined by the minimum distance of two shapes resulting in them compining into one. This is the most common operation as the entire scene could be viewed as one big union.
{{< figure src="/images/union.png" align="left" width="30%" >}}
###### min(a,b)

#### Subtraction
Subtraction can be used to remove volumes from shapes. It can be thought of as creating a hole in the shape of one SDF in another.
{{< figure src="/images/subtraction.png" align="left" width="30%" >}}
###### max(-a,b)

#### Intersection
An intersection only shows the part where two shapes intersect. This is something i implemented but ended up not using as most things didn't intersect so it made most of the scene invisible. 
{{< figure src="/images/intersection.png" align="left" width="30%" >}}
###### max(aShapeA,aShapeB)

#### Smoothing
All of these functions also have smoothed equivalents that can be used to create a "blobby" look to shapes which is something i ofcourse decided to implement.
