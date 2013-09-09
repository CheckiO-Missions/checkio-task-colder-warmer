from math import hypot
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.multicall import CheckiORefereeMulti

from tests import TESTS

MAX_STEP = 10


def initial_referee(data):
    data["step_count"] = 0
    return data


def process_referee(referee_data, user_result):
    goal = referee_data['goal']
    prev_steps = referee_data['input']
    referee_data['step_count'] += 1
    if referee_data['step_count'] > MAX_STEP:
        referee_data.update({"result": False, "result_addon": "Too many moves."})
        return referee_data
    if not isinstance(user_result, (list, tuple)) or len(user_result) != 2:
        referee_data.update({"result": False, "result_addon": "The function should return a list with two values."})
        return referee_data
    row, col = user_result
    if not isinstance(row, int) or not isinstance(col, int):
        referee_data.update({"result": False, "result_addon": "Result list format is [int, int]"})
        return referee_data
    if 10 <= row or 0 > row or 10 <= col or 0 > col:
        referee_data.update({"result": False, "result_addon": "You gave wrong coordinates."})
        return referee_data

    prev_distance = hypot(prev_steps[-1][0] - goal[0], prev_steps[-1][1] - goal[1])
    distance = hypot(row - goal[0], col - goal[1])
    alteration = 0 if prev_distance == distance else (1 if prev_distance > distance else -1)
    prev_steps.append([row, col, alteration])
    referee_data.update({"result": True, "result_addon": "Next Step"})
    return referee_data



def is_win_referee(referee_data):
    goal = referee_data['goal']
    prev_steps = referee_data['input']
    return goal == prev_steps[-1][:2]

api.add_listener(
    ON_CONNECT,
    CheckiORefereeMulti(
        tests=TESTS,
        initial_referee=initial_referee,
        process_referee=process_referee,
        is_win_referee=is_win_referee,
        ).on_ready)
