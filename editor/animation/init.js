requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function ulam_warburton_automaton_visualization(tgt_node, data) {

            if (!data || !data.ext) {
                return
            }

            const input = data.in[0]

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                on_hex: {
                    'stroke-width': '0.1px',
                    'stroke': '#ffc965',
                    'fill': '#294270',
                },
            }

            /*----------------------------------------------*
             *
             * values
             *
             *----------------------------------------------*/
            const grid_size_px = 200
            const os = 15

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const paper = Raphael(tgt_node, grid_size_px + os*2, grid_size_px + +os*2, 0, 0)

            /*----------------------------------------------*
             *
             * (function) solution of this mission
             *
             *----------------------------------------------*/
             function automaton(step) {
                const on_hexes = new Set([[0, 0, 0].toString()])
                let new_hexes = new Set([[0, 0, 0].toString()])

                function adj_hexes(q, r, s) {
                        const result = []
                        const coord_d = [[0, -1, 1], [1, -1, 0], [1, 0, -1], [0, 1, -1], [-1, 1, 0], [-1, 0, 1]]
                        coord_d.forEach(([dq, dr, ds])=>{
                            result.push([q+dq, r+dr, s+ds].toString())
                        })
                        return result
                }

                for (let i = 0; i < step - 1; i += 1) {
                    const search_hexes = new_hexes
                    new_hexes = new Set()
                    search_hexes.forEach(s_coord=>{
                        const all_adj_hexes = new Set()
                        const [sq, sr, ss] = s_coord.split(',').map(x=>parseInt(x))
                        adj_hexes(sq, sr, ss).forEach(a_coord=>{
                            if (! on_hexes.has(a_coord)) {
                                all_adj_hexes.add(a_coord)
                            }
                        })
                        all_adj_hexes.forEach(adj_coord=>{
                            const [jq, jr, js] = adj_coord.split(',').map(x=>parseInt(x))
                            let sum = 0
                            adj_hexes(jq, jr, js).forEach(a_coord=>{
                                if (on_hexes.has(a_coord)) {
                                    sum += 1
                                }
                            })
                            if (sum == 1) {
                                new_hexes.add([jq, jr, js].toString())
                            }
                        })
                    })
                    new_hexes.forEach(coords=>{
                        on_hexes.add(coords)
                    })
                }
                return on_hexes
            }

            /*----------------------------------------------*
             *
             * (function) draw hex
             *
             *----------------------------------------------*/
            function draw_hex(q, r, s) {
                const R = Math.min(13, grid_size_px/((input-1)*2+1) / 2 * 5/4)
                const base = Math.sqrt(R**2-(R/2)**2)
                const deg = 30
                const cx = grid_size_px/2 + os + q*base - s*base
                const cy = grid_size_px/2 + os - q*(R/2) - s*(R/2) + r*R
                let hexagon_path = ['M']
                for (let i = 0; i < 6; i += 1) {
                    const x1 = Math.cos(Math.PI*2*((deg+i*60)/360))*R
                    const y1 = Math.sin(Math.PI*2*((deg+i*60)/360))*R
                    const x2 = Math.cos(Math.PI*2*((deg+(i+1)*60)/360))*R
                    const y2 = Math.sin(Math.PI*2*((deg+(i+1)*60)/360))*R
                    if (i == 0) {
                        hexagon_path = hexagon_path.concat([x1+cx, y1+cy])
                    }
                    hexagon_path = hexagon_path.concat(['L', x2+cx, y2+cy])
                }
                hexagon_path.push('z')
                return paper.path(hexagon_path).attr(attr.on_hex)
            }

            /*----------------------------------------------*
             *
             * draw ulam_warburton_automaton
             *
             *----------------------------------------------*/
            automaton(input).forEach(cood=>{
                const [q, r, s] = cood.split(',').map(x=>parseInt(x))
                draw_hex(q, r, s)
            })
        }

        var io = new extIO({
            animation: function($expl, data){
                ulam_warburton_automaton_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
