
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.multicall import CheckiORefereeMulti

from tests import TESTS

MAX_STEP = 10


def initial_referee(data):
    data["step"] = 0
    return data


def process_referee(referee_data, user_result):
    pass


def is_win_referee(referee_data):
    pass

api.add_listener(
    ON_CONNECT,
    CheckiORefereeMulti(
        tests=TESTS,
        initial_referee=initial_referee,
        process_referee=process_referee,
        is_win_referee=is_win_referee,
        ).on_ready)
