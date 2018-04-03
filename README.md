gbrain
============
April 2 2018
<h1>GPU Javascript Library for Machine Learning</h1>

<p>The creation of this library comes after my investigation about how avoid out to CPU when perform GPU neural network infference/training along every neural network layers.</p>
<p>I achieved a solution to this for using an Adjacency Matrix which allow know the relation easily on GPU. It's more used in real-time Graph systems GPU based but I can't see any library using it on neural networks.</p>
<p>Through this system the leak to CPU is avoided and the CPU infference read is only performed in the last layer (out layer). On entire WebGL applications that may need a neural network system, this technique would allow entire neural network execution over GPU.</p>   
<p>At the same time batch is executed in the same way, allowing inyect at this moment until 7 direct experiences at the same time per tick for training or 7 direct infferences at the same time per tick and WebGL context.</p>
<h2>DEMOS</h2>
<br />
<a href="http://stormcolour.appspot.com/gbrain/demos/gbrain-reinforcement-learning/">- ConvNet Reinforcement Learning demo integration</a><br />
<a href="http://stormcolour.appspot.com/gbrain/demos/gbrain-reinforcement-learning/"><img src="demos/graph-neuronal-network/capture.jpg" style="width:150px"/></a> <br />
<br />