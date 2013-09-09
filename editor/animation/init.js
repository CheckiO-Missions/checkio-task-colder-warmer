//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }
            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + ext.JSON.encode(data.in) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var checkioInput = data.in;
            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];
            var isWin = data.ext["is_win"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + ext.JSON.encode(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + ext.JSON.encode(checkioInput) + ')');
                $content.find('.answer').html(result_addon);
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + ext.JSON.encode(checkioInput) + ')');
                $content.find('.answer').remove();
            }

            var canvas = new ColderWarmerCanvas($content.find(".explanation")[0]);
            canvas.createCanvas(checkioInput);


            this_e.setAnimationHeight($content.height() + 60);

        });

       

        var colorOrange4 = "#F0801A";
        var colorOrange3 = "#FA8F00";
        var colorOrange2 = "#FAA600";
        var colorOrange1 = "#FABA00";

        var colorBlue4 = "#294270";
        var colorBlue3 = "#006CA9";
        var colorBlue2 = "#65A1CF";
        var colorBlue1 = "#8FC7ED";

        var colorGrey4 = "#737370";
        var colorGrey3 = "#D9E9E";
        var colorGrey2 = "#C5C6C6";
        var colorGrey1 = "#EBEDED";

        var colorWhite = "#FFFFFF";

        function ColderWarmerCanvas(dom) {
            var x0 = 10,
                y0 = 10,
                cellSize = 30,
                cellN = 10;

            var fullSize = (cellN + 1) * cellSize + x0 * 2;
            var radius = cellSize * 0.35;

            var attrNumb = {"font-family": "verdana", "font-size": cellSize * 0.6, "stroke": colorBlue4, "fill": colorBlue4};
            var attrRect = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorGrey1};
            var attrCircleWarm = {"stroke": colorOrange4, "stroke-width": 2, "fill": colorOrange2};
            var attrCircleCold = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue2};
            var attrCircleSame = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorGrey2};
            var attrLineWarm = {"stroke": colorOrange4, "stroke-width": 2, "arrow-end": "classic-wide-long"};
            var attrLineCold = {"stroke": colorBlue4, "stroke-width": 2, "arrow-end": "classic-wide-long"};
            var attrLineSame = {"stroke": colorGrey4, "stroke-width": 2, "arrow-end": "classic-wide-long"};


            var paper = Raphael(dom, fullSize, fullSize, 0, 0);

            this.createCanvas = function(steps) {
                for (var row = 0; row < cellN; row++) {
                    paper.text(
                        x0 + cellSize * 1.5 + cellSize * row,
                        fullSize - (y0 + cellSize * cellN + cellSize / 2),
                        row
                    ).attr(attrNumb);
                    paper.text(
                        x0 + cellSize / 2,
                        y0 + cellSize * 1.5 + cellSize * row,
                        row
                    ).attr(attrNumb);
                    for (var col = 0; col < cellN; col++) {
                        paper.rect(
                            x0 + cellSize + cellSize * col,
                            y0 + cellSize * (row + 1),
                            cellSize, cellSize
                        ).attr(attrRect);
                    }
                }
                var p;
                for (var s = 0; s < steps.length; s++) {
                    paper.circle(
                        steps[s][1] * cellSize + cellSize * 1.5 + x0,
                        steps[s][0] * cellSize + cellSize * 1.5 + y0,
                        radius
                    ).attr(steps[s][2] === 0 ? attrCircleSame : (steps[s][2] == 1 ? attrCircleWarm : attrCircleCold));

                    if (s !== 0 && (steps[s - 1][0] !== steps[s][0] || steps[s - 1][1] !== steps[s][1])) {
                        var prevP = p;
                        p = paper.path(Raphael.format(
                           "M{0},{1}L{2},{3}",
                            steps[s - 1][1] * cellSize + cellSize * 1.5 + x0,
                            steps[s - 1][0] * cellSize + cellSize * 1.5 + y0,
                            steps[s][1] * cellSize + cellSize * 1.5 + x0,
                            steps[s][0] * cellSize + cellSize * 1.5 + y0
                        ));
                        p.attr(steps[s][2] === 0 ? attrLineSame : (steps[s][2] == 1 ? attrLineWarm : attrLineCold));
                        if (prevP){
                            prevP.toFront();
                        }
                    }
                }
            }
        }


    }
);
