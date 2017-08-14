# LSTM Demo

Demonstrates training a simple autoregressive LSTM network in Tensorflow and
then porting that model to deeplearn.js.

This network uses two BasicLSTMCells combined with MultiRNNCell. The network is
trained the memorize the first few digits of pi.

First, train the LSTM network with Tensorflow:

```
python demos/lstm/train.py
```

Next, export the weights to be used by deeplearn.js.:

```
python scripts/dump_checkpoint_vars.py --output_dir=demos/lstm/ --checkpoint_file=/tmp/simple_lstm-1000 --remove_variables_regex=".*Adam.*|.*beta.*"
```

Finally, start the demo:

```
scripts/watch-demo demos/lstm/lstm.ts
```
