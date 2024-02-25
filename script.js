$(document).ready(function() {
    // init var
    const FLIP_TIMER = 300
    let can_open = true
    const LIST_ICON = [
        '🤩', '👌', '💖', '😾',
        '🎨', '🍔', '🍙', '🌹',
        '🎃', '💨', '🔰', '🎦',
        '💬', '🚖', '🔥', '💧',
        '🎭', '🙏'
    ]
    let card_icon_list = [];
    let timer = {
        hour: 0,
        minute: 0,
        second: 0,
        draw_hour: '',
        draw_minute: '00:',
        draw_second: '00',
    }
    let interval_timer;
    let board_size = 4;

    function setIcon() {
        shuffle(LIST_ICON)
        card_icon_list = []
        let selected_icon = []

        LIST_ICON.map((icon, index) => {
            if(index < (board_size**2)/2) selected_icon.push(icon)
        })

        selected_icon.map((icon) => {
            card_icon_list.push(icon, icon)
        })
    
        shuffle(card_icon_list)
    }
    setIcon()

    function drawGrid(n) {
        const EL = `<div class="box">
            <div class="card"></div>
        </div>`

        let draw_el = '';

        for(let i = 0; i < n**2; i++) draw_el += EL
        
        $('#board').css('grid-template-rows', `repeat(${n}, 1fr)`)
        $('#board').css('grid-template-columns', `repeat(${n}, 1fr)`)

        $('#board').html(draw_el)
    }
    drawGrid(board_size)


    let rand_array = [];
    $(document).on('click', '.card:not(.open):not(.match)', function() {
        if(!interval_timer) startTimer()
        if(can_open) {
            can_open = false

            let index_card = $(this).parent().index()
            let card = $(this)
            card.css('transform', 'rotateY(90deg)')
            
            setTimeout(() => {
                card.html(card_icon_list[index_card])
                card.addClass('open')
                card.css('transform', 'rotateY(0deg)')

                setTimeout(() => {
                    if($('.card.open').length > 1) {
                        let check_icon = [];
                        $('.card.open').each(function() {
                            check_icon.push($(this).parent().index())
                        })
                        if(card_icon_list[check_icon[0]] === card_icon_list[check_icon[1]]) {
                            $('.card.open').addClass('match')
                            $('.card.open.match').removeClass('open');

                            if($('.card.match').length === board_size**2) {
                                clearInterval(interval_timer)
                                alert('You win')
                            }
                        } else {
                            $('.card.open').css('transform', 'rotateY(90deg)')
                            setTimeout(() => {
                                $('.card.open').html('')
                                $('.card.open').css('transform', 'rotateY(0deg)')
                                $('.card.open').removeClass('open')
                            }, FLIP_TIMER)
                        }
                    }
                    can_open = true
                }, FLIP_TIMER)

            }, FLIP_TIMER)
        }
    })

    $(document).on('click', '#restart', function() {
        board_size = parseInt($('#level').val())
        timer = {
            hour: 0,
            minute: 0,
            second: 0,
            draw_hour: '',
            draw_minute: '00:',
            draw_second: '00',
        }
        clearInterval(interval_timer)
        interval_timer = undefined
        $('#timer').html('00:00')
        setIcon()
        drawGrid(board_size)
    })

    function startTimer() {
        interval_timer = setInterval(() => {
            if(timer.second < 60-1) {
                timer.second++
                if(timer.second < 10) {
                    timer.draw_second = '0'+timer.second
                } else {
                    timer.draw_second = timer.second
                }
            } else {
                timer.second = 0;
                timer.draw_second = "00";

                if(timer.minute < 60-1) {
                    timer.minute++
                    if(timer.minute < 10) {
                        timer.draw_minute = '0'+timer.minute+':'
                    } else {
                        timer.draw_minute = timer.minute+':'
                    }
                } else {
                    timer.minute = 0;
                    timer.draw_minute = "00:"
                    timer.hour++
                    if(timer.hour === 0) {
                        timer.draw_hour = ''
                    } else if(timer.hour < 10) {
                        timer.draw_hour = '0'+timer.hour+':'
                    } else {
                        timer.draw_hour = timer.hour+':'
                    }
                }
            }

            $('#timer').html(timer.draw_hour+timer.draw_minute+timer.draw_second)

        }, 1000)
    }


    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

          // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
          // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    
        return array;
    }
})