function renderCode() {
	var examples = document.getElementsByClassName('example');
	if (examples.length > 0) {

		var sketches = examples[0].getElementsByTagName('code');
		var sketches_array = Array.prototype.slice.call(sketches);
    sketches_array.forEach(function(s) {
    	setupCode(s);
    	runCode(s);
		});
	}

	function setupCode(sketch) {

		var runnable = sketch.innerText;

		// sketch
		sketch.style.position = 'absolute';
		sketch.style.top = 0;
		sketch.style.left = '150px';
		sketch.parentNode.style.position = 'relative';
		sketch.parentNode.style.height = '200px';

		// store original sketch
		var orig_sketch = document.createElement('div');
		orig_sketch.innerHTML = sketch.innerHTML;

		// create canvas
		var cnv = document.createElement('div');
		cnv.className = 'cnv_div';
		cnv.style.position = 'absolute';
		sketch.parentNode.insertBefore(cnv, sketch);


		// create edit space
		var edit_space = document.createElement('div');
		edit_space.style.position = 'absolute';
		edit_space.style.top = 0;
		edit_space.style.left = '150px';
		sketch.parentNode.appendChild(edit_space);

		//add buttons
		var edit_button = document.createElement('button');
		edit_button.value = 'edit';
		edit_button.innerHTML = 'edit';
		edit_space.appendChild(edit_button);
		edit_button.onclick = function(e) {
			if (edit_button.innerHTML === 'edit') { // edit
				edit_button.innerHTML = 'run';
				edit_area.style.display = 'block';
			} else { // run
				edit_button.innerHTML = 'edit';
				edit_area.style.display = 'none';
				sketch.innerHTML = edit_area.value;
				runCode(sketch);
			}
		}


		var reset_button = document.createElement('button');
		reset_button.value = 'reset';
		reset_button.innerHTML = 'reset';
		edit_space.appendChild(reset_button);
		reset_button.onclick = function() {
			sketch.innerText = orig_sketch.innerText;
			edit_area.value = orig_sketch.innerText;
			runCode(sketch);
		};

		var edit_area = document.createElement('textarea');
		edit_area.value = runnable;
		edit_area.rows = 8;
		edit_area.cols = 80;
		edit_area.position = 'absolute'
		edit_space.appendChild(edit_area);
		edit_area.style.display = 'none';

	}

	function runCode(sketch) {

		var runnable = sketch.innerText;
		var cnv = sketch.parentNode.getElementsByClassName('cnv_div')[0];
		cnv.innerHTML = '';

		var keys = Object.getOwnPropertyNames(p5.prototype);
		keys.sort(function(a, b){
		  return b.length - a.length;
		});

		var reg = '(';
		for (var k=0; k<keys.length; k++) {
			reg += keys[k];
			if (k !== keys.length - 1) {
				reg += '|';
			}
		}
		reg += ')';

		runnable = runnable.replace(new RegExp(reg, 'g'), 'p.$1');

		var s = function( p ) {

			if (runnable.indexOf('setup()') === -1 && runnable.indexOf('draw()') === -1){
				p.setup = function() {
					p.createCanvas(100, 100);
					p.background(200);
					eval(runnable);
				}
			}
			else {

				p.setup = function() {
					p.createCanvas(100, 100);
					p.background(200);
				}
				
				eval(runnable);

        var fxns = ['setup', 'draw', 'preload', 'mousePressed', 'mouseReleased', 'mouseMoved', 'mouseDragged', 'mouseClicked', 'mouseWheel', 'touchStarted', 'touchMoved', 'touchEnded'];
				fxns.forEach(function(f) { 
					if (runnable.indexOf(f) !== -1) {
						p[f] = eval(f);
					}
				});

			}
		};

		prettyPrint();

		setTimeout(function() { var myp5 = new p5(s, cnv); }, 100);
	}

}