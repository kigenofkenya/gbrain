gbrain
============
April 2 2018
<h1>GPU Javascript Library for Machine Learning</h1>

<p>The creation of this library comes after investigation and work about how avoid out to CPU when perform GPU neural network infference/training along every neural network layers.</p>
<p>I achieved a solution to this for using an Adjacency Matrix which allow know the relation easily on GPU. It's more used in real-time Graph systems GPU based but I can't saw any library using it over GPU neural networks.</p>
<p>Exist a limitation of 4096 neurons by the fact of use an Adjacency Matrix but through this system the leak to CPU is avoided on the middle layers and the CPU infference read is only performed in the last layer (out layer). On entire WebGL applications that may need a neural network system this technique would allow entire neural network execution over GPU.</p>   
<p>At the same time batch is executed in the same way, allowing inyect at this moment until 7 direct experiences at the same time per tick for training or 7 direct infferences at the same time per tick and WebGL context.</p>
<p>
<a href="http://stormcolour.appspot.com/gbrain/demos/gbrain-reinforcement-learning/">- ConvNet Reinforcement Learning demo integration</a><br />
<a href="http://stormcolour.appspot.com/gbrain/demos/gbrain-reinforcement-learning/"><img src="demos/graph-neuronal-network/capture.jpg" style="width:150px"/></a> 
</p>
<h2>How this work</h2>
<p>The Adjacency Matrix is a texture which besides to have indicated the relations (by the Adjacency Matrix nature), on these is indicated the next properties too:</p>
    <ul>
    <li>1. neuron A (id)</li>
    <li>2. neuron B (id)</li>
    <li>3. neuron A == target neuron</li>
    <li>4. weight</li>
    <li>5. neuron layer</li>
    </ul>
<p>Of this manner is able to know and communicate the output function of one neuron with another neuron and propagate the error back too without we have send information to CPU on every layer result.</p>
<p>On backpropagation the weight data is updated over the Adjacency Matrix</p>
