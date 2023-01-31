# D3
Data Driven Documents


# My D3 Portfolio 
## Capability Map
[filename](portfolio/capability/index.html ':include :type=iframe width=1000px height=800px')

**Explanation**

The idea of a capability map is to visualize the capabilities of an organizational entity in a hierarchical way. Every organizational capability is decomposed into sub capabilities, which in turn are also decomposed. 

At the lowest level capabilities are assigned a score for current and ambition state. The difference between the two is then colour coded in green, yellow and red. 

## Transformation Map
[filename](portfolio/transmap/index.html ':include :type=iframe width=1200px height=1000px')

**Explanation**

A transformation map is a tool to visualize a roadmap for an organization. It consists of two dimensions, usually _Time_ and _Aspect_. Initiatives (or projects) are then plotted onto the transformation map, indicating when these initiatives should take place. 

Please look at this [Medium Article](https://medium.com/@rene.nadorp/a-dynamic-transformation-map-visualization-787b86765de) for detailed information regarding the creation of this visual. 

You can find all the code on GitHub [here](https://github.com/renenadorp/D3/tree/master/transmap)

## Links
[filename](portfolio/links/index.html ':include :type=iframe width=900px height=500px')

**Explanation**

This visual shows links to webpages in a hierarchical structure using D3.
The data for this visual comes from a google sheet with the following structure (including sample content):

|TabId|GroupId|LinkId|TabKey|GroupKey|LinkKey|Active|Tab|Group|Link|Url|
|--|--|--|--|--|--|--|--|--|--|--|
1|44|281|Tab-1-Knowledge|Group-44-D3|Link-281-D3 Wiki|1|Knowledge|D3
1|44|282|Tab-1-Knowledge|Group-44-D3|Link-282-Sunlight Style Guide|1|Knowledge|D3
1|44|283|Tab-1-Knowledge|Group-44-D3|Link-283-Data Viz Style Guides|1|Knowledge|D3
1|44|233|Tab-1-Knowledge|Group-44-D3|Link-233-Observable|1|Knowledge|D3

The code itself (and the visual) can be found on [ObservableHQ](https://observablehq.com/@renenadorp/link-tree). Feel free to use as you like. 


## Maturity
[filename](portfolio/maturity/index.html ':include :type=iframe width=1200px height=800px')
