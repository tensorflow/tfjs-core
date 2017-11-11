import * as d3 from 'd3';

import { PolymerElement, PolymerHTMLElement } from '../polymer-spec';
import { Array1D, Array2D, CostReduction, Graph, InputProvider, NDArray, NDArrayMath, NDArrayMathCPU, NDArrayMathGPU, Scalar, Session, SGDOptimizer, Tensor } from '../deeplearn';

const BATCH_SIZE = 100;
const ATLAS_SIZE = 10000;

const PLOT_SIZE_PX = 500;
const NUM_GRID_CELLS = 25;
const NUM_MANIFOLD_CELLS = 10;
const GENERATED_SAMPLES_VISUALIZATION_INTERVAL = 10;
const NUM_SAMPLES_VISUALIZED = 250;
const NUM_TRUE_SAMPLES_VISUALIZED = 250;

// tslint:disable-next-line:variable-name
const GANLabPolymer: new () => PolymerHTMLElement = PolymerElement({
  is: 'gan-lab',
  properties: {}
});

class GANLab extends GANLabPolymer {
  private math: NDArrayMath;
  private mathGPU: NDArrayMathGPU;
  private mathCPU: NDArrayMathCPU;

  private graph: Graph;
  private session: Session;
  private iterationCount: number;

  private gOptimizer: SGDOptimizer;
  private dOptimizer: SGDOptimizer;
  private predictionTensor1: Tensor;
  private predictionTensor2: Tensor;
  private gCostTensor: Tensor;
  private dCostTensor: Tensor;

  private noiseTensor: Tensor;
  private inputTensor: Tensor;
  private generatedTensor: Tensor;

  private noiseProvider: InputProvider;
  private inputProvider: InputProvider;
  private uniformNoiseProvider: InputProvider;
  private uniformInputProvider: InputProvider;
  private noiseProviderCount: number;
  private inputProviderCount: number;
  private uniformNoiseProviderCount: number;
  private uniformInputProviderCount: number;

  private startButton: HTMLInputElement;
  private stopButton: HTMLInputElement;

  private noiseSize: number;
  private numGeneratorLayers: number;
  private numDiscriminatorLayers: number;
  private numGeneratorNeurons: number;
  private numDiscriminatorNeurons: number;
  private learningRate: number;
  private kSteps: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private isDrawing: boolean;
  private drawingPositions: Array<[number, number]>;

  ready() {
    const noiseSlider = this.querySelector('#noise-slider') as HTMLInputElement;
    const noiseSizeElement = this.querySelector('#noise-size') as HTMLElement;
    this.noiseSize = +noiseSlider.value;
    noiseSlider.addEventListener('value-change', (event) => {
      this.noiseSize = +noiseSlider.value;
      noiseSizeElement.innerText = this.noiseSize.toString();
      this.createExperiment();
    });

    const gLayersSlider =
      this.querySelector('#g-layers-slider') as HTMLInputElement;
    const numGeneratorLayersElement =
      this.querySelector('#num-g-layers') as HTMLElement;
    this.numGeneratorLayers = +gLayersSlider.value;
    gLayersSlider.addEventListener('value-change', (event) => {
      this.numGeneratorLayers = +gLayersSlider.value;
      numGeneratorLayersElement.innerText = this.numGeneratorLayers.toString();
      this.createExperiment();
    });

    const dLayersSlider =
      this.querySelector('#d-layers-slider') as HTMLInputElement;
    const numDiscriminatorLayersElement =
      this.querySelector('#num-d-layers') as HTMLElement;
    this.numDiscriminatorLayers = +dLayersSlider.value;
    dLayersSlider.addEventListener('value-change', (event) => {
      this.numDiscriminatorLayers = +dLayersSlider.value;
      numDiscriminatorLayersElement.innerText =
        this.numDiscriminatorLayers.toString();
      this.createExperiment();
    });

    const gNeuronsSlider =
      this.querySelector('#g-neurons-slider') as HTMLInputElement;
    const numGeneratorNeuronsElement =
      this.querySelector('#num-g-neurons') as HTMLElement;
    this.numGeneratorNeurons = +gNeuronsSlider.value;
    gNeuronsSlider.addEventListener('value-change', (event) => {
      this.numGeneratorNeurons = +gNeuronsSlider.value;
      numGeneratorNeuronsElement.innerText =
        this.numGeneratorNeurons.toString();
      this.createExperiment();
    });

    const dNeuronsSlider =
      this.querySelector('#d-neurons-slider') as HTMLInputElement;
    const numDiscriminatorNeuronsElement =
      this.querySelector('#num-d-neurons') as HTMLElement;
    this.numDiscriminatorNeurons = +dNeuronsSlider.value;
    dNeuronsSlider.addEventListener('value-change', (event) => {
      this.numDiscriminatorNeurons = +dNeuronsSlider.value;
      numDiscriminatorNeuronsElement.innerText =
        this.numDiscriminatorNeurons.toString();
      this.createExperiment();
    });

    const kStepsSlider =
      this.querySelector('#k-steps-slider') as HTMLInputElement;
    const kStepsElement = this.querySelector('#k-steps') as HTMLElement;
    this.kSteps = +kStepsSlider.value;
    kStepsSlider.addEventListener('value-change', (event) => {
      kStepsElement.innerText = kStepsSlider.value;
      this.kSteps = +kStepsSlider.value;
      this.createExperiment();
    });

    const learningRateSlider =
      this.querySelector('#learning-rate-slider') as HTMLInputElement;
    const learningRateElement =
      this.querySelector('#learning-rate') as HTMLElement;
    this.learningRate = Math.pow(10, -1 * (+learningRateSlider.value));
    learningRateSlider.addEventListener('value-change', (event) => {
      learningRateElement.innerText = learningRateSlider.value;
      this.learningRate = Math.pow(10, -1 * +learningRateSlider.value);
      this.createExperiment();
    });

    this.shapeNames = ['Line', 'Two Hills', 'Drawing'];
    this.selectedShapeName = 'Line';
    this.querySelector('#shape-dropdown')!.addEventListener(
      // tslint:disable-next-line:no-any event has no type
      'iron-activate', (event: any) => {
        this.selectedShapeName = event.detail.selected;
        if (this.selectedShapeName === 'Drawing') {
          this.onClickStopButton();
          this.prepareDrawing();
        } else {
          this.createExperiment();
        }
      });

    this.querySelector('#overlap-plots')!.addEventListener(
      'change', (event: Event) => {
        const container =
          this.querySelector('#vis-discriminator-output') as SVGGElement;
        // tslint:disable-next-line:no-any
        container.style.visibility =
          (event.target as any).active ? 'visible' : 'hidden';
      });
    this.querySelector('#enable-manifold')!.addEventListener(
      'change', (event: Event) => {
        const container = this.querySelector('#vis-manifold') as SVGGElement;
        // tslint:disable-next-line:no-any
        container.style.visibility =
          (event.target as any).active ? 'visible' : 'hidden';
      });
    this.querySelector('#show-g-samples')!.addEventListener(
      'change', (event: Event) => {
        const container =
          this.querySelector('#vis-generated-samples') as SVGGElement;
        // tslint:disable-next-line:no-any
        container.style.visibility =
          (event.target as any).active ? 'visible' : 'hidden';
      });
    this.querySelector('#show-t-samples')!.addEventListener(
      'change', (event: Event) => {
        const container =
          this.querySelector('#vis-true-samples') as SVGGElement;
        // tslint:disable-next-line:no-any
        container.style.visibility =
          (event.target as any).active ? 'visible' : 'hidden';
      });

    this.startButton =
      document.getElementById('start-training') as HTMLInputElement;
    this.startButton.addEventListener('click', () => this.onClickStartButton());
    this.stopButton =
      document.getElementById('stop-training') as HTMLInputElement;
    this.stopButton.addEventListener('click', () => this.onClickStopButton());
    const incrementButton =
      document.getElementById('increment-training') as HTMLInputElement;
    incrementButton.addEventListener(
      'click', () => this.onClickIncrementButton());

    this.iterCountElement =
      document.getElementById('iteration-count') as HTMLElement;

    // Drawing-related.
    this.drawingPositions = [];
    this.isDrawing = false;
    this.canvas =
      document.getElementById('input-drawing-canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.context.strokeStyle = 'rgba(0, 136, 55, 0.25)';
    this.context.lineJoin = 'round';
    this.context.lineWidth = 10;
    const drawingContainer =
      document.getElementById('visualization-container') as HTMLDivElement;
    const offsetLeft = drawingContainer.offsetLeft + 10;
    const offsetTop = drawingContainer.offsetTop + 10;

    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDrawing = true;
      this.draw([event.pageX - offsetLeft, event.pageY - offsetTop]);
    });
    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDrawing) {
        this.draw([event.pageX - offsetLeft, event.pageY - offsetTop]);
      }
    });
    this.canvas.addEventListener('mouseup', (event: Event) => {
      this.isDrawing = false;
    });
    this.finishDrawingButton =
      document.getElementById('finish-drawing') as HTMLInputElement;
    this.finishDrawingButton.addEventListener(
      'click', () => this.onClickFinishDrawingButton());

    // Visualization.
    const plotMargin = 20;
    const plotPadding = 10;
    const descriptionHeight = 90;
    const plotAreaWidth = PLOT_SIZE_PX + plotPadding * 2 + plotMargin;

    d3.select('svg#vis-svg')
      .attr('width', plotAreaWidth + plotPadding * 2)
      .attr('height', PLOT_SIZE_PX + plotPadding * 2 + descriptionHeight);

    this.vis =
      d3.select('#vis-samples')
        .attr('transform', `translate(${plotPadding},${plotPadding})`);
    this.vis.select('rect.plot-border')
      .attr('width', PLOT_SIZE_PX)
      .attr('height', PLOT_SIZE_PX);
    this.visTrueSamples = this.vis.select('#vis-true-samples');
    this.visGeneratedSamples = this.vis.select('#vis-generated-samples');

    this.visDiscriminator =
      d3.select('#vis-discriminator-output')
        .attr('transform', `translate(${plotPadding},${plotPadding})`);
    this.visDiscriminator.select('rect.plot-bg')
      .attr('width', PLOT_SIZE_PX)
      .attr('height', PLOT_SIZE_PX);
    this.colorScale = d3.scaleLinear<string>().domain([0.0, 0.5, 1.0]).range([
      '#af8dc3', '#f5f5f5', '#7fbf7b'
    ]);

    this.visManifold =
      d3.select('#vis-manifold')
        .attr('transform', `translate(${plotPadding},${plotPadding})`);

    d3.select('#vis-descriptions')
      .attr(
      'transform',
      `translate(${plotPadding},${plotPadding * 2 + PLOT_SIZE_PX})`);

    this.mathGPU = new NDArrayMathGPU();
    this.mathCPU = new NDArrayMathCPU();
    this.math = this.mathCPU;

    this.createExperiment();
  }

  private createExperiment() {
    this.startButton.innerText = 'Start';
    this.stopTraining = true;
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    this.iterationCount = 0;
    this.iterCountElement.innerText = this.iterationCount;

    this.recreateCharts();

    this.visTrueSamples.selectAll('.true-dot').data([]).exit().remove();
    this.visGeneratedSamples.selectAll('.generated-dot')
      .data([])
      .exit()
      .remove();
    this.visDiscriminator.selectAll('.uniform-dot').data([]).exit().remove();
    this.visManifold.selectAll('.uniform-generated-dot')
      .data([])
      .exit()
      .remove();
    this.visManifold.selectAll('.manifold-cells').data([]).exit().remove();
    this.visManifold.selectAll('.grids').data([]).exit().remove();

    this.buildNetwork();

    if (this.session != null) {
      this.session.dispose();
    }
    this.session = new Session(this.graph, this.math);

    // Atlases.
    this.noiseAtlas =
      Array2D.randUniform([NUM_SAMPLES_VISUALIZED, this.noiseSize], 0.0, 1.0);

    const inputAtlasList = [];
    for (let i = 0; i < ATLAS_SIZE; ++i) {
      const distribution =
        this.sampleFromTrueDistribution(this.selectedShapeName);
      inputAtlasList.push(distribution[0]);
      inputAtlasList.push(distribution[1]);
    }
    this.inputAtlas = Array2D.new([ATLAS_SIZE, 2], inputAtlasList);

    const uniformInputAtlasList = [];
    for (let j = 0; j < NUM_GRID_CELLS; ++j) {
      for (let i = 0; i < NUM_GRID_CELLS; ++i) {
        uniformInputAtlasList.push((i + 0.5) / NUM_GRID_CELLS);
        uniformInputAtlasList.push((j + 0.5) / NUM_GRID_CELLS);
      }
    }
    this.uniformInputAtlas = Array2D.new(
      [NUM_GRID_CELLS * NUM_GRID_CELLS, 2], uniformInputAtlasList);
    if (this.noiseSize <= 2) {
      const uniformNoiseAtlasList = [];
      if (this.noiseSize === 1) {
        for (let i = 0; i < NUM_MANIFOLD_CELLS + 1; ++i) {
          uniformNoiseAtlasList.push(i / NUM_MANIFOLD_CELLS);
        }
      } else {
        for (let i = 0; i < NUM_MANIFOLD_CELLS + 1; ++i) {
          for (let j = 0; j < NUM_MANIFOLD_CELLS + 1; ++j) {
            uniformNoiseAtlasList.push(i / NUM_MANIFOLD_CELLS);
            uniformNoiseAtlasList.push(j / NUM_MANIFOLD_CELLS);
          }
        }
      }
      this.uniformNoiseAtlas = Array2D.new(
        [Math.pow(NUM_MANIFOLD_CELLS + 1, this.noiseSize), this.noiseSize],
        uniformNoiseAtlasList);
    }

    // Providers from Atlases.
    this.noiseProviderCount = -1;
    this.inputProviderCount = -1;
    this.uniformNoiseProviderCount = -1;
    this.uniformInputProviderCount = -1;
    const demo = this;
    this.noiseProvider = {
      getNextCopy() {
        demo.noiseProviderCount++;
        return demo.math.scope(() => {
          return demo.math
            .slice2D(
            demo.noiseAtlas,
            [demo.noiseProviderCount % NUM_SAMPLES_VISUALIZED, 0],
            [1, demo.noiseSize])
            .as1D();
        });
      },
      disposeCopy(math, copy) {
        copy.dispose();
      }
    };

    this.inputProvider = {
      getNextCopy() {
        demo.inputProviderCount++;
        return demo.math.scope(() => {
          return demo.math
            .slice2D(
            demo.inputAtlas, [demo.inputProviderCount % ATLAS_SIZE, 0],
            [1, 2])
            .as1D();
        });
      },
      disposeCopy(math, copy) {
        copy.dispose();
      }
    };

    this.uniformNoiseProvider = {
      getNextCopy() {
        demo.uniformNoiseProviderCount++;
        return demo.math.scope(() => {
          const begin: [number, number] = [
            demo.uniformNoiseProviderCount %
            Math.pow(NUM_MANIFOLD_CELLS + 1, demo.noiseSize),
            0
          ];
          return demo.math
            .slice2D(demo.uniformNoiseAtlas, begin, [1, demo.noiseSize])
            .as1D();
        });
      },
      disposeCopy(math, copy) {
        copy.dispose();
      }
    };

    this.uniformInputProvider = {
      getNextCopy() {
        demo.uniformInputProviderCount++;
        return demo.math.scope(() => {
          const begin: [number, number] = [
            demo.uniformInputProviderCount % (NUM_GRID_CELLS * NUM_GRID_CELLS),
            0
          ];
          return demo.math.slice2D(demo.uniformInputAtlas, begin, [1, 2])
            .as1D();
        });
      },
      disposeCopy(math, copy) {
        copy.dispose();
      }
    };
    this.visualizeTrueDistribution(inputAtlasList);
  }

  private sampleFromTrueDistribution(selectedShapeName: string) {
    const rand = Math.random();
    if (selectedShapeName === 'Drawing') {
      const index = Math.floor(this.drawingPositions.length * rand);
      return [
        this.drawingPositions[index][0] + 0.02 * this.randNormal(),
        this.drawingPositions[index][1] + 0.02 * this.randNormal()
      ];
    } else if (selectedShapeName === 'Line') {
      return [
        0.8 - 0.75 * rand + 0.01 * this.randNormal(),
        0.6 + 0.3 * rand + 0.01 * this.randNormal()
      ];
    } else if (selectedShapeName === 'Two Hills') {
      if (rand < 0.5)
        return [0.3 + 0.1 * this.randNormal(), 0.7 + 0.1 * this.randNormal()];
      else
        return [0.7 + 0.05 * this.randNormal(), 0.4 + 0.2 * this.randNormal()];
    } else {
      throw new Error('Invalid true distribution');
    }
  }

  randNormal() {
    const u = 1 - Math.random();
    const v = 1 - Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  private visualizeTrueDistribution(inputAtlasList: number[]) {
    const trueDistribution = [];
    while (trueDistribution.length < NUM_TRUE_SAMPLES_VISUALIZED) {
      trueDistribution.push(inputAtlasList.splice(0, 2));
    }

    this.visTrueSamples.selectAll('.true-dot')
      .data(trueDistribution)
      .enter()
      .append('circle')
      .attr('class', 'true-dot gan-lab')
      .attr('r', 2)
      .attr('cx', (d: number[]) => d[0] * PLOT_SIZE_PX)
      .attr('cy', (d: number[]) => (1.0 - d[1]) * PLOT_SIZE_PX)
      .append('title')
      .text((d: number[]) => `${d[0].toFixed(2)}, ${d[1].toFixed(2)}`);
  }

  private prepareDrawing() {
    this.drawingPositions = [];
    this.context.clearRect(
      0, 0, this.context.canvas.width, this.context.canvas.height);
    const drawingElement =
      this.querySelector('#drawing-container') as HTMLElement;
    drawingElement.style.display = 'block';
    const drawingBackgroundElement =
      this.querySelector('#drawing-disable-background') as HTMLDivElement;
    drawingBackgroundElement.style.display = 'block';
  }

  private onClickFinishDrawingButton() {
    const drawingElement =
      this.querySelector('#drawing-container') as HTMLElement;
    drawingElement.style.display = 'none';
    const drawingBackgroundElement =
      this.querySelector('#drawing-disable-background') as HTMLDivElement;
    drawingBackgroundElement.style.display = 'none';
    this.createExperiment();
  }

  private onClickStartButton() {
    this.startButton.disabled = true;
    this.stopTraining = false;
    this.stopButton.disabled = false;

    this.iterateTraining(true);
  }

  private onClickStopButton() {
    this.stopButton.disabled = true;
    this.startButton.innerText = 'Resume';
    this.startButton.disabled = false;
    this.stopTraining = true;
  }

  private onClickIncrementButton() {
    if (this.stopTraining) {
      this.stopTraining = false;
      this.iterateTraining(false);
      this.stopTraining = true;
    }
  }

  private iterateTraining(keepIterating: boolean) {
    if (this.stopTraining) {
      return;
    }

    this.iterationCount++;

    this.math.scope(() => {
      for (let j = 0; j < this.kSteps - 1; j++) {
        this.session.train(
          this.dCostTensor,
          [
            { tensor: this.inputTensor, data: this.inputProvider },
            { tensor: this.noiseTensor, data: this.noiseProvider }
          ],
          BATCH_SIZE, this.dOptimizer, CostReduction.MEAN);
      }

      const dCost = this.session.train(
        this.dCostTensor,
        [
          { tensor: this.inputTensor, data: this.inputProvider },
          { tensor: this.noiseTensor, data: this.noiseProvider }
        ],
        BATCH_SIZE, this.dOptimizer, CostReduction.MEAN);
      const gCost = this.session.train(
        this.gCostTensor,
        [{ tensor: this.noiseTensor, data: this.noiseProvider }], BATCH_SIZE,
        this.gOptimizer, CostReduction.MEAN);

      this.iterCountElement.innerText = this.iterationCount;

      if (!keepIterating || this.iterationCount === 1 ||
        this.iterationCount % GENERATED_SAMPLES_VISUALIZATION_INTERVAL === 0) {

        // Update charts.
        this.dCostChartData.push({ x: this.iterationCount, y: dCost.get() });
        this.gCostChartData.push({ x: this.iterationCount, y: gCost.get() });
        this.costChart.update();

        // Visualize discriminator's output.
        const dData = [];
        for (let i = 0; i < NUM_GRID_CELLS * NUM_GRID_CELLS; ++i) {
          const result = this.session.eval(
            this.predictionTensor1,
            [{ tensor: this.inputTensor, data: this.uniformInputProvider }]);
          dData.push(result.getValues());
        }

        const gridDots =
          this.visDiscriminator.selectAll('.uniform-dot').data(dData);
        if (this.iterationCount === 1) {
          gridDots.enter()
            .append('rect')
            .attr('class', 'uniform-dot gan-lab')
            .attr('width', PLOT_SIZE_PX / NUM_GRID_CELLS)
            .attr('height', PLOT_SIZE_PX / NUM_GRID_CELLS)
            .attr(
            'x',
            (d: number, i: number) =>
              (i % NUM_GRID_CELLS) * (PLOT_SIZE_PX / NUM_GRID_CELLS))
            .attr(
            'y',
            (d: number, i: number) => PLOT_SIZE_PX -
              (Math.floor(i / NUM_GRID_CELLS) + 1) *
              (PLOT_SIZE_PX / NUM_GRID_CELLS))
            .style('fill', (d: number) => this.colorScale(d))
            .append('title')
            .text((d: number) => Number(d).toFixed(3));
        }
        gridDots.style('fill', (d: number) => this.colorScale(d));
        gridDots.select('title').text((d: number) => Number(d).toFixed(3));

        // Visualize generated samples.
        const gData = [];
        for (let i = 0; i < NUM_SAMPLES_VISUALIZED; ++i) {
          const result = this.session.eval(
            this.generatedTensor,
            [{ tensor: this.noiseTensor, data: this.noiseProvider }]);
          gData.push(result.getValues());
        }

        const gDots =
          this.visGeneratedSamples.selectAll('.generated-dot').data(gData);
        if (this.iterationCount === 1) {
          gDots.enter()
            .append('circle')
            .attr('class', 'generated-dot gan-lab')
            .attr('r', 2)
            .attr('cx', (d: number[]) => d[0] * PLOT_SIZE_PX)
            .attr('cy', (d: number[]) => (1.0 - d[1]) * PLOT_SIZE_PX);
        }
        gDots.attr('cx', (d: number[]) => d[0] * PLOT_SIZE_PX)
          .attr('cy', (d: number[]) => (1.0 - d[1]) * PLOT_SIZE_PX);

        // Visualize manifold for 1-D or 2-D noise.
        interface ManifoldCell {
          points: Array<[number, number]>;
          area?: number;
        }

        if (this.noiseSize <= 2) {
          const manifoldData: Array<[number, number]> = [];
          for (let i = 0; i < Math.pow(NUM_MANIFOLD_CELLS + 1, this.noiseSize);
            ++i) {
            const result = this.session.eval(
              this.generatedTensor,
              [{ tensor: this.noiseTensor, data: this.uniformNoiseProvider }]);
            manifoldData.push([result.getValues()[0], result.getValues()[1]]);
          }

          // Create grid cells.
          const gridData: ManifoldCell[] = [];
          let areaSum = 0.0;
          if (this.noiseSize === 1) {
            gridData.push({ points: manifoldData });
          } else if (this.noiseSize === 2) {
            for (let i = 0; i < NUM_MANIFOLD_CELLS * NUM_MANIFOLD_CELLS; ++i) {
              const x = i % NUM_MANIFOLD_CELLS;
              const y = Math.floor(i / NUM_MANIFOLD_CELLS);
              const index = x + y * (NUM_MANIFOLD_CELLS + 1);

              const gridCell = [];
              gridCell.push(manifoldData[index]);
              gridCell.push(manifoldData[index + 1]);
              gridCell.push(manifoldData[index + 1 + (NUM_MANIFOLD_CELLS + 1)]);
              gridCell.push(manifoldData[index + (NUM_MANIFOLD_CELLS + 1)]);
              gridCell.push(manifoldData[index]);

              // Calculate area by using four points.
              let area = 0.0;
              for (let j = 0; j < 4; ++j) {
                area += gridCell[j % 4][0] * gridCell[(j + 1) % 4][1] -
                  gridCell[j % 4][1] * gridCell[(j + 1) % 4][0];
              }
              area = 0.5 * Math.abs(area);
              areaSum += area;

              gridData.push({ points: gridCell, area });
            }
            // Normalize area.
            gridData.forEach(grid => {
              if (grid.area) {
                grid.area = grid.area / areaSum;
              }
            });
          }

          const manifoldCell =
            d3.line()
              .x((d: number[]) => d[0] * PLOT_SIZE_PX)
              .y((d: number[]) => (1.0 - d[1]) * PLOT_SIZE_PX);

          const grids = this.visManifold.selectAll('.grids').data(gridData);

          if (this.iterationCount === 1) {
            grids.enter()
              .append('g')
              .attr('class', 'grids gan-lab')
              .append('path')
              .attr('class', 'manifold-cell gan-lab');
          }
          grids.select('.manifold-cell')
            .attr('d', (d: ManifoldCell) => manifoldCell(d.points))
            .style(
            'fill',
            () => {
              return this.noiseSize === 2 ? '#7b3294' : 'none';
            })
            .style('fill-opacity', (d: ManifoldCell) => {
              return this.noiseSize === 2 ?
                Math.max(0.95 - d.area! * 45.0, 0.05) :
                'none';
            });

          const manifoldDots =
            this.visManifold.selectAll('.uniform-generated-dot')
              .data(manifoldData);
          if (this.iterationCount === 1) {
            manifoldDots.enter()
              .append('circle')
              .attr('class', 'uniform-generated-dot gan-lab')
              .attr('r', 1);
          }
          manifoldDots.attr('cx', (d: number[]) => d[0] * PLOT_SIZE_PX)
            .attr('cy', (d: number[]) => (1.0 - d[1]) * PLOT_SIZE_PX);
        }
      }
    });

    if (this.iterationCount > 10000) {
      this.stopTraining = false;
    }

    requestAnimationFrame(() => this.iterateTraining(true));
  }

  private buildNetwork() {
    this.graph = new Graph();
    const g = this.graph;

    // Noise.
    const noise = g.placeholder('noise', [this.noiseSize]);
    this.noiseTensor = noise;

    // Generator.
    let network = g.layers.dense(
      'gfc0', noise, this.numGeneratorNeurons, (x) => g.relu(x));

    for (let i = 0; i < this.numGeneratorLayers; ++i) {
      network = g.layers.dense(
        `gfc${i + 1}`, network, this.numGeneratorNeurons, (x) => g.relu(x));
    }

    this.generatedTensor =
      g.layers.dense('gfcLast', network, 2, (x) => g.sigmoid(x));

    // Real samples.
    this.inputTensor = g.placeholder('input', [2]);

    // Discriminator.
    const dfc0W = g.variable(
      'dfc0W',
      NDArray.randTruncatedNormal(
        [2, this.numDiscriminatorNeurons], 0, 1.0 / Math.sqrt(2)));
    const dfc0B =
      g.variable('dfc0B', NDArray.zeros([this.numDiscriminatorNeurons]));

    let network1 = g.matmul(this.inputTensor, dfc0W);
    network1 = g.add(network1, dfc0B);
    network1 = g.relu(network1);

    let network2 = g.matmul(this.generatedTensor, dfc0W);
    network2 = g.add(network2, dfc0B);
    network2 = g.relu(network2);

    for (let i = 0; i < this.numDiscriminatorLayers; ++i) {
      const dfcW = g.variable(
        `dfc${i + 1}W`,
        NDArray.randTruncatedNormal(
          [this.numDiscriminatorNeurons, this.numDiscriminatorNeurons], 0,
          1.0 / Math.sqrt(this.numDiscriminatorNeurons)));
      const dfcB = g.variable(
        `dfc${i + 1}B`, Array1D.zeros([this.numDiscriminatorNeurons]));

      network1 = g.matmul(network1, dfcW);
      network1 = g.add(network1, dfcB);
      network1 = g.relu(network1);

      network2 = g.matmul(network2, dfcW);
      network2 = g.add(network2, dfcB);
      network2 = g.relu(network2);
    }

    const dfcLastW = g.variable(
      'dfcLastW',
      NDArray.randTruncatedNormal(
        [this.numDiscriminatorNeurons, 1], 0,
        1.0 / Math.sqrt(this.numDiscriminatorNeurons)));
    const dfcLastB = g.variable('dfcLastB', NDArray.zeros([1]));

    network1 = g.matmul(network1, dfcLastW);
    network1 = g.add(network1, dfcLastB);
    network1 = g.sigmoid(network1);
    network1 = g.reshape(network1, []);
    this.predictionTensor1 = network1;

    network2 = g.matmul(network2, dfcLastW);
    network2 = g.add(network2, dfcLastB);
    network2 = g.sigmoid(network2);
    network2 = g.reshape(network2, []);
    this.predictionTensor2 = network2;

    // Define losses.
    const dRealCostTensor = g.log(this.predictionTensor1);
    const dFakeCostTensor = g.log(
      g.subtract(g.constant(Scalar.new(1)), this.predictionTensor2));
    this.dCostTensor = g.multiply(
      g.add(dRealCostTensor, dFakeCostTensor), g.constant(Scalar.new(-1)));
    this.gCostTensor = g.multiply(
      g.log(this.predictionTensor2), g.constant(Scalar.new(-1)));

    // Filter variable nodes for optimizers.
    const gNodes = g.getNodes().filter(v => {
      return v.name.slice(0, 3) === 'gfc';
    });
    const dNodes = g.getNodes().filter(v => {
      return v.name.slice(0, 3) === 'dfc';
    });

    this.gOptimizer = new SGDOptimizer(this.learningRate, gNodes);
    this.dOptimizer = new SGDOptimizer(this.learningRate, dNodes);
  }

  private recreateCharts() {
    this.dCostChartData = [];
    this.gCostChartData = [];
    if (this.costChart != null) {
      this.costChart.destroy();
    }
    this.costChart = this.createChart(
      'cost-chart', 'Cost', this.dCostChartData, this.gCostChartData, 0, 2);
  }

  private createChart(
    canvasId: string, label: string, data1: ChartData[], data2: ChartData[],
    min?: number, max?: number): Chart {
    const context = (document.getElementById(canvasId) as HTMLCanvasElement)
      .getContext('2d') as CanvasRenderingContext2D;
    return new Chart(context, {
      type: 'line',
      data: {
        datasets: [
          {
            data: data1,
            fill: false,
            label: 'Discriminator\'s Loss',
            pointRadius: 0,
            borderColor: 'rgba(5, 117, 176, 0.5)',
            borderWidth: 1,
            lineTension: 0,
            pointHitRadius: 8
          },
          {
            data: data2,
            fill: false,
            label: 'Generator\'s Loss',
            pointRadius: 0,
            borderColor: 'rgba(123, 50, 148, 0.5)',
            borderWidth: 1,
            lineTension: 0,
            pointHitRadius: 8
          }
        ]
      },
      options: {
        animation: { duration: 0 },
        responsive: false,
        scales: {
          xAxes: [{ type: 'linear', position: 'bottom' }],
          yAxes: [{
            ticks: {
              max,
              min,
            }
          }]
        }
      }
    });
  }
  private draw(position: [number, number]) {
    this.drawingPositions.push(
      [position[0] / PLOT_SIZE_PX, 1.0 - position[1] / PLOT_SIZE_PX]);
    this.context.beginPath();
    this.context.moveTo(position[0] - 1, position[1]);
    this.context.lineTo(position[0], position[1]);
    this.context.closePath();
    this.context.stroke();
  }
}

document.registerElement(GANLab.prototype.is, GANLab);
