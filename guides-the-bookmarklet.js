javascript:(function() {
    document.body.style.position = 'relative';
    var currentColor = 'magenta';
    var uniqueClass = 'drawn-svg-' + Math.floor(Math.random() * 1000000);

    function preventDefaultForShiftClick(e) {
        if (e.shiftKey) {
            e.preventDefault();
        }
    }

    function removeSvg(e) {
        if (e.altKey) {
            e.target.remove();
            e.stopPropagation();
        }
    }

    function createSvg(x, y, width, height) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add(uniqueClass);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.zIndex = '999999';

        if (width === '100vw') {
            svg.style.left = '0';
            svg.style.top = (window.scrollY + y) + 'px';
        } else {
            svg.style.left = x + 'px';
            svg.style.top = '0'; // 縦に長いSVGのためにtopを0に設定
        }

        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', currentColor);
        svg.appendChild(rect);

        svg.addEventListener('click', removeSvg);
        document.body.appendChild(svg);
    }

    function createColorChip(color) {
        var chip = document.createElement('div');
        chip.style.width = '20px';
        chip.style.height = '20px';
        chip.style.backgroundColor = color;
        chip.style.boxSizing = 'border-box';
        if (color === 'white') {
            chip.style.border = '1px solid #d7d7d7';
        }
        chip.style.display = 'inline-block';
        chip.style.cursor = 'pointer';
        chip.style.margin = '2px';
        chip.onclick = function(e) {
            e.stopPropagation();
            currentColor = color;
            updateSvgColors();
        };
        return chip;
    }

    function updateSvgColors() {
        var svgs = document.querySelectorAll('.' + uniqueClass + ' rect');
        svgs.forEach(function(rect) {
            rect.setAttribute('fill', currentColor);
        });
    }

    function deleteAllSvgs() {
        var svgs = document.querySelectorAll('.' + uniqueClass);
        svgs.forEach(function(svg) {
            svg.remove();
        });
    }

    document.addEventListener('mousedown', preventDefaultForShiftClick);
    document.addEventListener('click', function(e) {
        if (e.altKey) return;

        if (e.target.tagName !== 'SVG' && e.target.tagName !== 'RECT' && e.target.className !== 'color-chip' && e.target.className !== 'delete-all-btn') {
            var x = e.clientX;
            var y = e.clientY;
            if (e.shiftKey) {
                createSvg(x, y, '1px', '100%');
            } else {
                createSvg(x, y, '100vw', '1px');
            }
        }
    });

    var colorPanel = document.createElement('div');
    colorPanel.style.display = 'flex';
    colorPanel.style.alignItems = 'center';
    colorPanel.style.position = 'fixed';
    colorPanel.style.left = '10px';
    colorPanel.style.top = '10px';
    colorPanel.style.zIndex = '999999';
    document.body.appendChild(colorPanel);

    var deleteAllButton = document.createElement('div');
    deleteAllButton.style.width = '90px';
    deleteAllButton.style.height = '20px';
    deleteAllButton.style.backgroundColor = '#c0c0c0';
    deleteAllButton.style.fontSize = '11px';
    deleteAllButton.style.fontFamily = 'Arial, sans-serif';
    deleteAllButton.style.color = 'white';
    deleteAllButton.style.textAlign = 'center';
    deleteAllButton.style.lineHeight = '20px';
    deleteAllButton.style.display = 'inline-block';
    deleteAllButton.style.cursor = 'pointer';
    deleteAllButton.style.margin = '2px';
    deleteAllButton.textContent = 'Delete All';
    deleteAllButton.className = 'delete-all-btn';
    deleteAllButton.onclick = function(e) {
        e.stopPropagation();
        deleteAllSvgs();
    };
    colorPanel.appendChild(deleteAllButton);

    var colors = ['magenta', 'cyan', 'green', 'yellow', 'white', 'black'];
    colors.forEach(function(color) {
        colorPanel.appendChild(createColorChip(color));
    });
})();
